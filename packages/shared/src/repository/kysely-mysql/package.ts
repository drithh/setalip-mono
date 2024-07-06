import { inject, injectable } from 'inversify';
import {
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
  SelectPackageTransaction,
  UpdatePackage,
  UpdatePackageTransaction,
} from '../package';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { ColumnType, sql } from 'kysely';
import { addDays } from 'date-fns';

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

  async findAll(data: FindAllPackageOptions) {
    const { page = 1, perPage = 10, sort, name, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackage} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('packages')
      .innerJoin('class_types', 'packages.class_type_id', 'class_types.id');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    if (types) {
      query = query.where('class_type_id', 'in', types);
    }
    const queryData = await query
      .selectAll('packages')
      .select('class_types.type as class_type')
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('packages.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  findById(id: SelectPackage['id']) {
    return this._db
      .selectFrom('packages')
      .selectAll()
      .where('packages.id', '=', id)
      .executeTakeFirst();
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
        'credit_transactions',
        'package_transactions.user_package_id',
        'credit_transactions.user_package_id'
      )
      .selectAll('package_transactions')
      .select([
        'packages.name as package_name',
        'packages.credit',
        'credit_transactions.expired_at as package_expired_at',
      ])
      .where('package_transactions.id', '=', id)
      .executeTakeFirst();
  }

  async findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ) {
    const packageSession = await this._db
      .with('ct_debit', (q) =>
        q
          .selectFrom('credit_transactions')
          .selectAll('credit_transactions')
          .where('credit_transactions.user_id', '=', user_id)
          .where('credit_transactions.expired_at', '>', new Date())
      )
      .selectFrom('ct_debit')
      .select([
        'ct_debit.class_type_id',
        'ct_debit.user_package_id',
        'ct_debit.amount',
        sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`.as(
          'amount_used'
        ),
      ])
      .leftJoin(
        'credit_transactions',
        'ct_debit.id',
        'credit_transactions.credit_transaction_id'
      )
      .groupBy(['ct_debit.id', 'ct_debit.user_package_id'])
      .having(
        'ct_debit.amount',
        '>',
        sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`
      )
      .execute();

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
      ])
      .execute();

    console.log('query', query, packageSession);

    const combined = query.map((userPackage) => {
      const packageTransaction = packageSession.find(
        (session) => session.user_package_id === userPackage.id
      );

      if (packageTransaction) {
        return {
          ...userPackage,
          credit_used: packageTransaction.amount_used,
        };
      } else {
        return {
          ...userPackage,
          credit_used: null,
        };
      }
    });

    return combined;
  }

  async findAboutToExpiredPackage(user_id: number, class_type: number) {
    const packageSession = await this._db
      .with('ct_debit', (q) =>
        q
          .selectFrom('credit_transactions')
          .selectAll('credit_transactions')
          .where('credit_transactions.user_id', '=', user_id)
          .where('credit_transactions.expired_at', '>', new Date())
      )
      .selectFrom('ct_debit')
      .select([
        'ct_debit.class_type_id',
        'ct_debit.user_package_id',
        'ct_debit.amount',
        sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`.as(
          'amount_used'
        ),
      ])
      .leftJoin(
        'credit_transactions',
        'ct_debit.id',
        'credit_transactions.credit_transaction_id'
      )
      .groupBy(['ct_debit.id', 'ct_debit.user_package_id'])
      .having(
        'ct_debit.amount',
        '>',
        sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`
      )
      .execute();

    const query = await this._db
      .selectFrom('user_packages')
      .innerJoin('packages', 'user_packages.package_id', 'packages.id')
      .innerJoin('class_types', 'packages.class_type_id', 'class_types.id')
      .where('user_packages.user_id', '=', user_id)
      .where('user_packages.expired_at', '>', new Date())
      .where('class_types.id', '=', class_type)
      .selectAll('user_packages')
      .select([
        'packages.name as package_name',
        'class_types.type as class_type',
      ])
      .orderBy('user_packages.expired_at', 'asc')
      .executeTakeFirst();

    if (!query) {
      return undefined;
    }

    const combined = {
      ...query,
      credit_used:
        packageSession.find((session) => session.user_package_id === query.id)
          ?.amount_used ?? null,
    };

    return combined;
  }

  async findPackageTransactionUniqueCode(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ) {
    const lastUniqueCode = await this._db
      .selectFrom('package_transactions')
      .select(['unique_code', 'deposit_account_id', 'package_transactions.id'])
      .where('package_transactions.user_id', '=', user_id)
      .where('package_transactions.package_id', '=', package_id)
      .where('status', '=', 'pending')
      .executeTakeFirst();

    if (lastUniqueCode) {
      return {
        unique_code: lastUniqueCode.unique_code,
        deposit_account_id: lastUniqueCode.deposit_account_id,
        id: lastUniqueCode.id,
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
      newUniqueCode = Math.floor(Math.random() * 1000);
    } while (uniqueCodes.has(newUniqueCode));

    return {
      unique_code: newUniqueCode,
      deposit_account_id: null,
      id: -1,
      is_new: true,
    };
  }

  async create(data: InsertPackage) {
    try {
      const query = this._db
        .insertInto('packages')
        .values(data)
        .returningAll()
        .compile();

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

        const total = queryPackage.price + data.unique_code;

        const queryUserPackage = trx
          .insertInto('package_transactions')
          .values({
            user_id: data.user_id,
            package_id: queryPackage.id,
            discount: data.discount,
            deposit_account_id: data.deposit_account_id,
            unique_code: data.unique_code,
            status: 'pending',
            amount_paid: total,
          })
          .returningAll()
          .compile();

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
          const userPackage = await trx
            .insertInto('user_packages')
            .values({
              user_id: packageTransaction.user_id,
              package_id: packageTransaction.package_id,
              expired_at: expiredAt,
              credit: singlePackage.credit,
            })
            .returningAll()
            .compile();

          const resultUserPackage = await trx.executeQuery(userPackage);

          if (resultUserPackage.rows[0] === undefined) {
            console.error('Failed to create user package', resultUserPackage);
            return new Error('Failed to create user package');
          }

          userPackageId = resultUserPackage.rows[0].id;

          const creditTransaction = await trx
            .insertInto('credit_transactions')
            .values({
              user_package_id: userPackageId,
              expired_at: expiredAt,
              note: `Credit from package ${singlePackage.name}`,
              class_type_id: singlePackage.class_type_id,
              user_id: packageTransaction.user_id,
              amount: singlePackage.credit,
              type: 'debit',
            })
            .returningAll()
            .compile();

          const resultCreditTransaction =
            await trx.executeQuery(creditTransaction);

          if (resultCreditTransaction.rows[0] === undefined) {
            console.error(
              'Failed to create credit transaction',
              resultCreditTransaction
            );
            return new Error('Failed to create credit transaction');
          }
        }

        const query = await trx
          .updateTable('package_transactions')
          .set({
            ...data,
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

  async delete(id: SelectPackage['id']) {
    try {
      const query = this._db
        .deleteFrom('packages')
        .where('packages.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete package', result);
        return new Error('Failed to delete package');
      }

      return;
    } catch (error) {
      console.error('Error deleting package:', error);
      return new Error('Failed to delete package');
    }
  }
}
