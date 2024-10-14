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
import { SelectPackageQuery } from '../package';
import { applyFilters, applyModifiers } from './util';
import { custom } from 'zod';

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

  async base(data?: SelectCreditQuery) {
    let baseQuery = this._db.selectFrom('credit_transactions');
    if (data?.filters) {
      baseQuery = baseQuery.where(
        applyFilters(data.filters, data.customFilters)
      );
    }

    return baseQuery;
  }

  async find<T extends SelectCredit>(data?: SelectCreditQuery) {
    let baseQuery = await this.base(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll().execute();
    return result as T[];
  }

  async findWithPagination<T extends SelectCredit>(data?: SelectCreditQuery) {
    let baseQuery = await this.base(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [
        fn.count<number>('credit_transactions.id').as('count'),
      ])
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

  async update({ data, trx, filters, customFilters }: UpdateCreditCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('credit_transactions')
        .set(data)
        .where(applyFilters(filters, customFilters))
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

  async delete({
    filters,
    trx,
    withAgendaBooking,
    customFilters,
  }: DeleteCreditCommand) {
    try {
      const db = trx ?? this._db;

      const query = await db
        .deleteFrom('credit_transactions')
        .$if(withAgendaBooking === true, (qb) =>
          qb.innerJoin(
            'agenda_bookings',
            'credit_transactions.agenda_booking_id',
            'agenda_bookings.id'
          )
        )
        .where(applyFilters(filters, customFilters))
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
