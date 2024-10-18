import { id, inject, injectable } from 'inversify';

import { Database, DB, Packages, Query } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import {
  ColumnType,
  Expression,
  expressionBuilder,
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
import {
  PackageRepository,
  SelectPackageQuery,
  SelectPackage,
  SelectUserPackageQuery,
  SelectUserPackage,
  SelectPackageTransactionQuery,
  SelectPackageTransaction,
  InsertPackageCommand,
  InsertPackageTransactionCommand,
  UpdatePackageCommand,
  DeletePackageCommand,
  UpdatePackageTransactionCommand,
  UpdateUserPackageCommand,
  InsertUserPackageCommand,
} from '../package';
import { SelectUserPackage__Package__ClassType__PackageTransaction } from '#dep/service/package';

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

  base(data?: SelectPackageQuery) {
    let baseQuery = this._db.selectFrom('packages');
    baseQuery = baseQuery.where(
      applyFilters(data?.filters, data?.customFilters)
    );
    if (data?.withClassType) {
      baseQuery = baseQuery
        .innerJoin('class_types', 'packages.class_type_id', 'class_types.id')
        .select('class_types.type as class_type');
    }
    return baseQuery;
  }

  async find<T extends SelectPackage>(data?: SelectPackageQuery) {
    let baseQuery = this.base(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll('packages').execute();
    return result as T[];
  }

  async findWithPagination<T extends SelectPackage>(data?: SelectPackageQuery) {
    let baseQuery = this.base(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [fn.count<number>('packages.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll('packages').execute();

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  baseUserPackage(data?: SelectUserPackageQuery) {
    let baseQuery = this._db.selectFrom('user_packages');
    baseQuery = baseQuery.where(
      applyFilters(data?.filters, data?.customFilters)
    );

    if (data?.withPackage) {
      const packageQuery = baseQuery
        .innerJoin('packages', 'user_packages.package_id', 'packages.id')
        .select([
          'packages.name as package_name',
          'packages.credit as package_credit',
        ]);

      if (data?.withClassType) {
        baseQuery = packageQuery
          .innerJoin('class_types', 'packages.class_type_id', 'class_types.id')
          .select([
            'class_types.type as class_type',
            'class_types.id as class_type_id',
          ]);
      }
    }

    if (data?.withCreditTransaction) {
      baseQuery = baseQuery
        .leftJoin(
          'credit_transactions',
          'user_packages.id',
          'credit_transactions.user_package_id'
        )
        .select(
          sql<number>`COALESCE(COUNT(credit_transactions.id), 0)`.as(
            'credit_used'
          )
        )
        .groupBy('user_packages.id') as SelectQueryBuilder<
        DB,
        'user_packages' | 'credit_transactions',
        {}
      >;
    }

    return baseQuery;
  }

  async findUserPackage<T extends SelectUserPackage>(
    data?: SelectUserPackageQuery
  ) {
    let baseQuery = this.baseUserPackage(data);

    baseQuery = applyModifiers(baseQuery, data);

    const result = await baseQuery.selectAll('user_packages').execute();

    return result as T[];
  }

  async findAllUserPackageActiveByUserId(
    user_id: SelectUserPackage['user_id']
  ) {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'user_packages' | 'credit_transactions'>();
    customFilters.push(eb('user_packages.expired_at', '>', new Date()));
    customFilters.push(eb('user_packages.user_id', '=', user_id));

    const packages =
      await this.findUserPackage<SelectUserPackage__Package__ClassType__PackageTransaction>(
        {
          orderBy: 'expired_at asc',
          customFilters: customFilters,
          withPackage: true,
          withClassType: true,
          withCreditTransaction: true,
        }
      );

    return packages;
  }

  basePackageTransaction(data?: SelectPackageTransactionQuery) {
    let baseQuery = this._db
      .selectFrom('package_transactions')
      .$if(data?.withPackage ?? false, (qb) =>
        qb
          .innerJoin(
            'packages',
            'package_transactions.package_id',
            'packages.id'
          )
          .select('packages.name as package_name')
      )
      .$if(data?.withUser ?? false, (qb) =>
        qb
          .innerJoin('users', 'package_transactions.user_id', 'users.id')
          .select('users.name as user_name')
      )
      .$if(data?.withDepositAccount ?? false, (qb) =>
        qb
          .innerJoin(
            'deposit_accounts',
            'package_transactions.deposit_account_id',
            'deposit_accounts.id'
          )
          .select('deposit_accounts.bank_name as deposit_account_bank')
      )
      .$if(data?.withUserPackage ?? false, (qb) =>
        qb
          .leftJoin(
            'user_packages',
            'package_transactions.user_package_id',
            'user_packages.id'
          )
          .leftJoin(
            'credit_transactions',
            'user_packages.id',
            'credit_transactions.user_package_id'
          )
          .select([
            'user_packages.expired_at as user_package_expired_at',
            'user_packages.credit as user_package_credit',
            sql<number>`COALESCE(COUNT(credit_transactions.id), 0)`.as(
              'user_package_credit_used'
            ),
          ])
          .groupBy('user_packages.id')
      );

    baseQuery = baseQuery.where(
      applyFilters(data?.filters, data?.customFilters)
    );

    return baseQuery;
  }

  async findPackageTransaction<T extends SelectPackageTransaction>(
    data?: SelectPackageTransactionQuery
  ) {
    let baseQuery = this.basePackageTransaction(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll('package_transactions').execute();
    return result as T[];
  }

  async findPackageTransactionWithPagination<
    T extends SelectPackageTransaction,
  >(data?: SelectPackageTransactionQuery) {
    let baseQuery = this.basePackageTransaction(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [
        fn.count<number>('package_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    baseQuery = applyModifiers(baseQuery, data);

    const queryData = await baseQuery
      .selectAll('package_transactions')
      .execute();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  async create({ data, trx }: InsertPackageCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('packages')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

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

  async createUserPackage({ data, trx }: InsertUserPackageCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('user_packages')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create user package', result);
        return new Error('Failed to create user package');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user package:', error);
      return new Error('Failed to create user package');
    }
  }

  async createPackageTransaction({
    data,
    trx,
  }: InsertPackageTransactionCommand) {
    try {
      const db = trx ?? this._db;

      const queryUserPackage = db
        .insertInto('package_transactions')
        .values({
          user_id: data.user_id,
          package_id: data.package_id,
          discount: data.discount,
          credit: data.credit,
          voucher_id: data.voucher_id,
          deposit_account_id: data.deposit_account_id,
          unique_code: data.unique_code,
          status: 'pending',
          amount_paid: data.amount_paid,
          voucher_discount: data.voucher_discount,
        })
        .returningAll()
        .compile();

      const resultUserPackage = await db.executeQuery(queryUserPackage);

      if (resultUserPackage.rows[0] === undefined) {
        console.error('Failed to create user package', resultUserPackage);
        return new Error('Failed to create user package');
      }

      return resultUserPackage.rows[0];
    } catch (error) {
      console.error('Error creating package transaction:', error);
      return new Error('Failed to create package transaction');
    }
  }

  async update({ data, trx, filters, customFilters }: UpdatePackageCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('packages')
        .set(data)
        .where(applyFilters(filters, customFilters))
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

  async updateUserPackage({
    data,
    trx,
    filters,
    customFilters,
  }: UpdateUserPackageCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('user_packages')
        .set(data)
        .where(applyFilters(filters, customFilters))
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update user package', query);
        return new Error('Failed to update user package');
      }

      return;
    } catch (error) {
      console.error('Error updating package:', error);
      return new Error('Failed to update package');
    }
  }

  async updatePackageTransaction({
    data,
    trx,
    filters,
    customFilters,
  }: UpdatePackageTransactionCommand) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .updateTable('package_transactions')
        .set(data)
        .where(applyFilters(filters, customFilters))
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update package transaction', query);
        return new Error('Failed to update package transaction');
      }

      return;
    } catch (error) {
      console.error('Error updating package transaction:', error);
      return new Error('Failed to update package transaction');
    }
  }

  async delete({ filters, trx, customFilters }: DeletePackageCommand) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .deleteFrom('packages')
        .where(applyFilters(filters, customFilters))
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
}
