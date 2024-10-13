import { id, inject, injectable } from 'inversify';
import {
  DeletePackageCommand,
  DeletePackageTranscationCommand,
  FindAllPackageOptions,
  FindAllUserPackageOption,
  FindAllUserPackageTransactionOption,
  InsertPackage,
  InsertPackageTransaction,
  PackageRepository,
  SelectAllActivePackage,
  SelectAllPackage,
  SelectAllPackageTransactionWithUser,
  SelectPackage,
  SelectPackageQuery,
  SelectPackageTransaction,
  SelectPackageTransactionQuery,
  UpdatePackage,
  UpdatePackageTransaction,
  UpdatePackageTransactionImage,
} from '../package';
import { Database, DB, Packages, Query } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import {
  ColumnType,
  Expression,
  ExpressionBuilder,
  OrderByExpression,
  ReferenceExpression,
  SelectQueryBuilder,
  sql,
  SqlBool,
} from 'kysely';
import { addDays } from 'date-fns';
import { entriesFromObject } from '#dep/util/index';
import { applyFilters, applyModifiers } from './util';

@injectable()
export class KyselyMySqlPackageRepository implements PackageRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('packages')
      .select(({ fn }) => [fn.count<number>('packages.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async find(data?: SelectPackageQuery) {
    let baseQuery = this._db.selectFrom('packages');
    if (data?.filters) {
      baseQuery = baseQuery.where(applyFilters(data.filters));
    }
    baseQuery.$call((qb) => applyModifiers(qb, data));

    return baseQuery.selectAll().execute();
  }

  async findWithPagination<T extends SelectPackage>(data?: SelectPackageQuery) {
    let baseQuery = this._db.selectFrom('packages');
    if (data?.filters) {
      baseQuery = baseQuery.where(applyFilters(data.filters));
    }

    if (data?.withClassType) {
      baseQuery = baseQuery
        .innerJoin('class_types', 'packages.class_type_id', 'class_types.id')
        .select('class_types.type as class_type');
    }

    const queryCount = await baseQuery
      .select(({ fn }) => [fn.count<number>('packages.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll().execute();

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  async findPackageTransaction(data?: SelectPackageTransactionQuery) {
    let baseQuery = this._db.selectFrom('package_transactions');
    if (data?.filters) {
      baseQuery = baseQuery.where(applyFilters(data.filters));
    }
    baseQuery = applyModifiers(baseQuery, data);
    return baseQuery.selectAll().execute();
  }

  async findPackageTransactionWithPagination(
    data?: SelectPackageTransactionQuery
  ) {
    let baseQuery = this._db.selectFrom('package_transactions');
    if (data?.filters) {
      baseQuery = baseQuery.where(applyFilters(data.filters));
    }

    const queryCount = await baseQuery
      .select(({ fn }) => [
        fn.count<number>('package_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll().execute();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  async findAllPackageTransaction(data: FindAllUserPackageTransactionOption) {
    const { page = 1, perPage = 10, sort, user_name, status } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackageTransaction} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('package_transactions')
      .innerJoin('packages', 'package_transactions.package_id', 'packages.id')
      .innerJoin('users', 'package_transactions.user_id', 'users.id')
      .innerJoin(
        'deposit_accounts',
        'package_transactions.deposit_account_id',
        'deposit_accounts.id'
      );

    if (status && status.length > 0) {
      query = query.where('package_transactions.status', 'in', status);
    }

    if (user_name) {
      query = query.where('users.name', 'like', `%${user_name}%`);
    }

    const queryData = await query
      .selectAll('package_transactions')
      .select([
        'packages.name as package_name',
        'users.name as user_name',
        'users.id as user_id',
        'deposit_accounts.bank_name as deposit_account_bank',
      ])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('package_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  async findAllPackageByUserId(user_id: SelectPackageTransaction['user_id']) {
    const query = await this._db
      .selectFrom('user_packages')
      .innerJoin('packages', 'user_packages.package_id', 'packages.id')
      .innerJoin('class_types', 'packages.class_type_id', 'class_types.id')
      .where('user_packages.user_id', '=', user_id)
      .where('user_packages.expired_at', '>', new Date())
      .selectAll('user_packages')
      .select([
        'packages.name as package_name',
        'class_types.type as class_type',
        'user_packages.credit as credit',
      ])
      .execute();

    return query;
  }

  async findAllPackageTransactionByUserId(data: FindAllUserPackageOption) {
    const { page = 1, perPage = 10, sort, user_id, status } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackageTransaction} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('package_transactions')
      .leftJoin(
        'user_packages',
        'package_transactions.user_package_id',
        'user_packages.id'
      )
      .innerJoin('packages', 'package_transactions.package_id', 'packages.id')
      .where('package_transactions.user_id', '=', user_id);

    if (status) {
      query = query.where('package_transactions.status', 'in', status);
    }

    const queryData = await query
      .selectAll('package_transactions')
      .select([
        'packages.name as package_name',
        'user_packages.expired_at as package_expired_at',
        'user_packages.credit as credit',
      ])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('package_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  findPackageTransactionById(id: SelectPackageTransaction['id']) {
    return this._db
      .selectFrom('package_transactions')
      .innerJoin('packages', 'package_transactions.package_id', 'packages.id')
      .leftJoin(
        'user_packages',
        'package_transactions.user_package_id',
        'user_packages.id'
      )
      .selectAll('package_transactions')
      .select([
        'packages.name as package_name',
        'packages.credit',
        'user_packages.expired_at as package_expired_at',
      ])
      .where('package_transactions.id', '=', id)
      .executeTakeFirst();
  }

  findPackageTransactionByVoucherIdAndUserId(
    voucher_id: SelectPackageTransaction['voucher_id'],
    user_id: SelectPackageTransaction['user_id']
  ) {
    return this._db
      .selectFrom('package_transactions')
      .selectAll()
      .where('package_transactions.voucher_id', '=', voucher_id)
      .where('package_transactions.user_id', '=', user_id)
      .executeTakeFirst();
  }

  async findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ) {
    const activePackages = await this._db
      .selectFrom('credit_transactions')

      .innerJoin(
        'user_packages',
        'credit_transactions.user_package_id',
        'user_packages.id'
      )
      .innerJoin('packages', 'user_packages.package_id', 'packages.id')
      .innerJoin(
        'class_types',
        'credit_transactions.class_type_id',
        'class_types.id'
      )
      .select([
        'class_types.type as class_type',
        sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`.as(
          'credit_used'
        ),
      ])
      .selectAll('packages')
      .where('user_packages.user_id', '=', user_id)
      .where('user_packages.expired_at', '>', new Date())
      .orderBy('user_packages.expired_at', 'asc')
      .where(sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`, '>', 0)
      .execute();

    return activePackages;
  }

  async findAboutToExpired(user_id: number, class_type: number) {
    const activePackages = await this.findAllActivePackageByUserId(user_id);

    const creditUsages = activePackages.find(
      (singlePackage) => singlePackage.class_type_id === class_type
    );

    return creditUsages;
  }

  async findPackageTransactionByUserIdAndPackageId(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ) {
    const lastUniqueCode = await this._db
      .selectFrom('package_transactions')
      .selectAll()
      .where('package_transactions.user_id', '=', user_id)
      .where('package_transactions.package_id', '=', package_id)
      .where('status', '=', 'pending')
      .executeTakeFirst();

    if (lastUniqueCode) {
      return {
        ...lastUniqueCode,
        is_new: false,
      };
    }

    // find a unique code that is not used by any other pending transaction
    const allPendingTransactions = await this._db
      .selectFrom('package_transactions')
      .select('unique_code')
      .where('status', '=', 'pending')
      .execute();

    const uniqueCodes = new Set(
      allPendingTransactions.map((transaction) => transaction.unique_code)
    );

    let newUniqueCode;
    do {
      newUniqueCode = Math.floor(Math.random() * 100);
    } while (uniqueCodes.has(newUniqueCode));

    return {
      user_id,
      package_id,
      is_new: true,
      unique_code: newUniqueCode,

      id: null,
      deposit_account_id: null,
      discount: null,
      voucher_discount: null,
      user_package_id: null,
      voucher_id: null,
    };
  }

  async create(data: InsertPackage) {
    try {
      const query = this._db
        .insertInto('packages')
        .values(data)
        .returningAll()
        .apply();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create package', result);
        return new Error('Failed to create package');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating package:', error);
      return new Error('Failed to create package');
    }
  }

  async createPackageTransaction(data: InsertPackageTransaction) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const queryPackage = await trx
          .selectFrom('packages')
          .selectAll()
          .where('packages.id', '=', data.package_id)
          .executeTakeFirst();

        if (queryPackage === undefined) {
          console.error('Package not found', queryPackage);
          return new Error('Package not found');
        }

        const queryUserPackage = trx
          .insertInto('package_transactions')
          .values({
            user_id: data.user_id,
            package_id: queryPackage.id,
            discount: data.discount,
            credit: queryPackage.credit + (queryPackage.discount_credit ?? 0),
            voucher_id: data.voucher_id,
            deposit_account_id: data.deposit_account_id,
            unique_code: data.unique_code,
            status: 'pending',
            amount_paid: data.amount_paid,
            voucher_discount: data.voucher_discount,
          })
          .returningAll()
          .apply();

        const resultUserPackage = await trx.executeQuery(queryUserPackage);

        if (resultUserPackage.rows[0] === undefined) {
          console.error('Failed to create user package', resultUserPackage);
          return new Error('Failed to create user package');
        }

        return resultUserPackage.rows[0];
      });
      return result;
    } catch (error) {
      console.error('Error creating package transaction:', error);
      return new Error('Failed to create package transaction');
    }
  }

  async update(data: UpdatePackage) {
    try {
      const query = await this._db
        .updateTable('packages')
        .set(data)
        .where('packages.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update package', query);
        return new Error('Failed to update package');
      }

      return;
    } catch (error) {
      console.error('Error updating package:', error);
      return new Error('Failed to update package');
    }
  }

  async updatePackageTransaction(data: UpdatePackageTransaction) {
    try {
      const trx = await this._db.transaction().execute(async (trx) => {
        const packageTransaction = await trx
          .selectFrom('package_transactions')
          .selectAll()
          .where('package_transactions.id', '=', data.id)
          .executeTakeFirst();

        if (packageTransaction === undefined) {
          console.error('Package transaction not found', packageTransaction);
          return new Error('Package transaction not found');
        }

        const singlePackage = await trx
          .selectFrom('packages')
          .selectAll()
          .where('packages.id', '=', packageTransaction.package_id)
          .executeTakeFirst();

        const expiredAt = addDays(new Date(), singlePackage?.valid_for ?? 0);

        if (singlePackage === undefined) {
          console.error('Package transaction not found', singlePackage);
          return new Error('Package transaction not found');
        }

        let userPackageId: number | null = null;

        if (data.status === 'completed') {
          // insert user package
          const userPackage = trx
            .insertInto('user_packages')
            .values({
              user_id: packageTransaction.user_id,
              package_id: packageTransaction.package_id,
              expired_at: expiredAt,
              credit: singlePackage.credit,
            })
            .returningAll()
            .apply();

          const resultUserPackage = await trx.executeQuery(userPackage);

          if (resultUserPackage.rows[0] === undefined) {
            console.error('Failed to create user package', resultUserPackage);
            return new Error('Failed to create user package');
          }

          userPackageId = resultUserPackage.rows[0].id;

          // const creditTransaction = await trx
          //   .insertInto('credit_transactions')
          //   .values({
          //     user_package_id: userPackageId,
          //     expired_at: expiredAt,
          //     note: `Purchase package ${singlePackage.name}`,
          //     class_type_id: singlePackage.class_type_id,
          //     user_id: packageTransaction.user_id,
          //     amount: packageTransaction.credit ?? singlePackage.credit,
          //     type: 'debit',
          //   })
          //   .returningAll()
          //   .apply();

          // const resultCreditTransaction =
          //   await trx.executeQuery(creditTransaction);

          // if (resultCreditTransaction.rows[0] === undefined) {
          //   console.error(
          //     'Failed to create credit transaction',
          //     resultCreditTransaction
          //   );
          //   return new Error('Failed to create credit transaction');
          // }

          const loyaltyTransaction = await trx
            .insertInto('loyalty_transactions')
            .values({
              note: `Loyalty from package ${singlePackage.name}`,
              user_id: packageTransaction.user_id,
              amount: singlePackage.loyalty_points,
              type: 'debit',
            })
            .returningAll()
            .apply();

          const resultLoyaltyTransaction =
            await trx.executeQuery(loyaltyTransaction);

          if (resultLoyaltyTransaction.rows[0] === undefined) {
            console.error(
              'Failed to create loyalty transaction',
              resultLoyaltyTransaction
            );
            return new Error('Failed to create loyalty transaction');
          }
        }

        const query = await trx
          .updateTable('package_transactions')
          .set({
            id: data.id,
            status: data.status,
            deposit_account_id:
              data.deposit_account_id ?? packageTransaction.deposit_account_id,
            amount_paid: data.amount_paid ?? packageTransaction.amount_paid,

            voucher_discount:
              data.voucher_discount ?? packageTransaction.voucher_discount,
            voucher_id: data.voucher_id ?? packageTransaction.voucher_id,

            user_package_id: userPackageId,
          })
          .where('package_transactions.id', '=', data.id)
          .executeTakeFirst();

        if (query.numUpdatedRows === undefined) {
          console.error('Failed to update package transaction', query);
          return new Error('Failed to update package transaction');
        }

        return {
          credit: singlePackage.credit,
          status: data.status,
          expired_at: expiredAt,
        };
      });

      return trx;
    } catch (error) {
      console.error('Error updating package transaction:', error);
      return new Error('Failed to update package transaction');
    }
  }

  async updatePackageTransactionImage(data: UpdatePackageTransactionImage) {
    try {
      const query = await this._db
        .updateTable('package_transactions')
        .set(data)
        .where('id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update package transaction image', query);
        return new Error('Failed to update package transaction image');
      }

      return undefined;
    } catch (error) {
      console.error('Error updating package transaction image:', error);
      return new Error('Failed to update package transaction image');
    }
  }

  async delete({ filters, trx }: DeletePackageCommand) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .deleteFrom('packages')
        .where(this.applyPackageFilters(filters))
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete package', query);
        return new Error('Failed to delete package');
      }
      return;
    } catch (error) {
      console.error('Error deleting package:', error);
      return new Error('Failed to delete package');
    }
  }

  async deletePexackageTransaction() {
    try {
      const packageTransactions = await this._db
        .selectFrom('package_transactions')
        .selectAll()
        .where('status', '=', 'pending')
        .where('created_at', '<', addDays(new Date(), -2))
        .execute();

      const result = await this._db
        .updateTable('package_transactions')
        .where('status', '=', 'pending')
        .where('created_at', '<', addDays(new Date(), -2))
        .set({
          status: 'failed',
        })
        .executeTakeFirst();

      if (result.numUpdatedRows === undefined) {
        console.error('Failed to delete package transaction', result);
        return new Error('Failed to delete package transaction');
      }

      return packageTransactions;
    } catch (error) {
      console.error('Error deleting package transaction:', error);
      return new Error('Failed to delete package transaction');
    }
  }
}
