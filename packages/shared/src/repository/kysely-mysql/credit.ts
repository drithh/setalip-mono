import { Database, CreditTransactions, DB } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  CreditRepository,
  DeleteCreditCommand,
  InsertCredit,
  InsertCreditCommand,
  SelectCredit,
  SelectCreditQuery,
  UpdateCredit,
  UpdateCreditCommand,
} from '../credit';
import {
  ExpressionBuilder,
  SelectQueryBuilder,
  sql,
  Transaction,
} from 'kysely';
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

  async join() {
    function hasDogNamed(
      name: Expression<string>,
      ownerId: Expression<number>
    ) {
      // Create an expression builder without any tables in the context.
      // This way we make no assumptions about the calling context.
      const eb = expressionBuilder<DB, never>();

      return eb.exists(
        eb
          .selectFrom('pet')
          .select('pet.id')
          .where('pet.owner_id', '=', ownerId)
          .where('pet.species', '=', 'dog')
          .where('pet.name', '=', name)
      );
    }
  }

  async find({
    filters,
    limit,
    offset,
    perPage,
    orderBy,
    customFilters,
  }: SelectCreditQuery) {
    let baseQuery = this._db.selectFrom('credit_transactions');
    if (filters) {
      baseQuery = baseQuery.where(this.compileFilters(filters));
    }
    if (customFilters) {
      baseQuery = baseQuery.where((eb) => eb.and(customFilters));
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

    return baseQuery.selectAll().execute();
  }

  async findWithPagination({
    filters,
    limit,
    offset,
    perPage,
    orderBy,
  }: SelectCreditQuery) {
    let baseQuery = this._db.selectFrom('credit_transactions');
    if (filters) {
      baseQuery = baseQuery.where(this.compileFilters(filters));
    }
    const count = (await baseQuery
      .select(({ fn }) => [
        fn.count<number>('credit_transactions.id').as('count'),
      ])
      .executeTakeFirst()) ?? { count: 0 };

    const pageCount = Math.ceil((count?.count ?? 0) / (perPage ?? 1));

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

    const data = await baseQuery.selectAll().execute();
    return { data, pageCount };
  }

  async create({ data, trx }: InsertCreditCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('credit_transactions')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

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

  async delete({ filters, trx }: DeleteCreditCommand) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .deleteFrom('credit_transactions')
        .where(this.compileFilters(filters))
        .executeTakeFirstOrThrow();

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
