import { Database, CreditTransactions, DB } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  CreditRepository,
  DeleteCredit,
  FindAllCreditOptions,
  InsertCredit,
  InsertCreditCommand,
  SelectCredit,
  SelectCreditQuery,
  UpdateCredit,
  UpdateCreditCommand,
} from '../credit';
import { ExpressionBuilder, sql, Transaction } from 'kysely';
import { SelectUser } from '../user';
import { entriesFromObject } from '#dep/util/index';

@injectable()
export class KyselyMySqlCreditRepository implements CreditRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('credit_transactions')
      .select(({ fn }) => [
        fn.count<number>('credit_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  private compileFilters(filters: Partial<SelectCredit>) {
    return (eb: ExpressionBuilder<DB, 'credit_transactions'>) => {
      const compiledFilters = entriesFromObject(filters).flatMap(
        ([key, value]) => (value !== undefined ? eb(key, '=', value) : [])
      );
      return eb.and(compiledFilters);
    };
  }

  async find({ filters, limit, offset, perPage, orderBy }: SelectCreditQuery) {
    let baseQuery = this._db.selectFrom('credit_transactions').selectAll();
    if (filters) {
      baseQuery = baseQuery.where(this.compileFilters(filters));
    }
    if (limit) {
      baseQuery = baseQuery.limit(limit);
    }
    if (offset) {
      baseQuery = baseQuery.offset(offset);
    }
    if (perPage) {
      baseQuery = baseQuery.limit(perPage);
    }
    if (orderBy) {
      baseQuery = baseQuery.orderBy(orderBy);
    }
    return baseQuery.execute();
  }

  // async findAllByUserId(data: FindAllCreditOptions) {
  //   const { page = 1, perPage = 10, sort } = data;

  //   const offset = (page - 1) * perPage;
  //   const orderBy = (
  //     sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
  //   ).join(' ') as `${keyof SelectCredit} ${'asc' | 'desc'}`;

  //   let query = this._db
  //     .selectFrom('credit_transactions')
  //     .where('credit_transactions.user_id', '=', data.user_id);

  //   const queryData = await query
  //     .selectAll()
  //     .limit(perPage)
  //     .offset(offset)
  //     .orderBy(orderBy)
  //     .execute();

  //   const queryCount = await query
  //     .select(({ fn }) => [
  //       fn.count<number>('credit_transactions.id').as('count'),
  //     ])
  //     .executeTakeFirst();

  //   return {
  //     data: queryData,
  //     pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
  //   };
  // }

  async create({ data, trx }: InsertCreditCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('credit_transactions')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create credit', result);
        return new Error('Failed to create credit');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating credit:', error);
      return new Error('Failed to create credit');
    }
  }

  async update({ data, trx }: UpdateCreditCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('credit_transactions')
        .set(data)
        .where('credit_transactions.id', '=', data.id)
        .executeTakeFirstOrThrow();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update credit', query);
        return new Error('Failed to update credit');
      }

      return;
    } catch (error) {
      console.error('Error updating credit:', error);
      return new Error('Failed to update credit');
    }
  }

  async delete({ filters, trx }: DeleteCredit) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .deleteFrom('credit_transactions')
        .where(this.compileFilters(filters))
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete credit', query);
        return new Error('Failed to delete credit');
      }
      return;
    } catch (error) {
      console.error('Error deleting credit:', error);
      return new Error('Failed to delete credit');
    }
  }
}
