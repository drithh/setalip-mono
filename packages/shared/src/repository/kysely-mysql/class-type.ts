import { Database, DB } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { injectable, inject } from 'inversify';
import { LocationRepository } from '../location';
import {
  ClassTypeRepository,
  DeleteClassTypeCommand,
  InsertClassType,
  InsertClassTypeCommand,
  SelectClassType,
  SelectClassTypeQuery,
  SelectClassTypeReturn,
  UpdateClassType,
  UpdateClassTypeCommand,
} from '..';
import { entriesFromObject } from '#dep/util/index';
import { ExpressionBuilder, sql } from 'kysely';
import { applyFilters } from './util';
import { QueryResult } from '#dep/types/index';
import { ClassTypeWithIncome } from '#dep/service/class-type';

@injectable()
export class KyselyMySqlClassTypeRepository implements ClassTypeRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('class_types')
      .select(({ fn }) => [fn.count<number>('class_types.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async find(data?: SelectClassTypeQuery) {
    let baseQuery = this._db.selectFrom('class_types');
    baseQuery = baseQuery.$if(
      data?.withIncome !== undefined,
      (qb): QueryResult<ClassTypeWithIncome> =>
        qb
          .innerJoin('classes', 'class_types.id', 'classes.class_type_id')
          .innerJoin('agendas', 'classes.id', 'agendas.class_id')
          .innerJoin(
            'agenda_bookings',
            'agendas.id',
            'agenda_bookings.agenda_id'
          )
          .innerJoin(
            'location_facilities',
            'agendas.location_facility_id',
            'location_facilities.id'
          )
          .innerJoin(
            'locations',
            'location_facilities.location_id',
            'locations.id'
          )
          .innerJoin(
            'credit_transactions',
            'agenda_bookings.id',
            'credit_transactions.agenda_booking_id'
          )
          .innerJoin(
            'user_packages',
            'credit_transactions.user_package_id',
            'user_packages.id'
          )
          .innerJoin(
            'package_transactions',
            'user_packages.id',
            'package_transactions.user_package_id'
          )
          .select([
            sql<number>`count(agenda_bookings.id)`.as('participant'),
            sql<number>`sum(IFNULL(package_transactions.amount_paid / package_transactions.credit, 0))`.as(
              'income'
            ),
          ])
          .groupBy('class_types.id')
    );
    if (data?.filters) {
      baseQuery = baseQuery.where(applyFilters(data.filters));
    }

    if (data?.orderBy) {
      baseQuery = baseQuery.orderBy(data.orderBy);
    }

    if (data?.offset) {
      baseQuery = baseQuery.offset(data.offset);
    }

    const result = baseQuery.selectAll().execute();
    return result;
  }

  async create({ data, trx }: InsertClassTypeCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('class_types')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create class type', result);
        return new Error('Failed to create class type');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating class type:', error);
      return new Error('Failed to create class type');
    }
  }

  async update({ data, trx }: UpdateClassTypeCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .updateTable('class_types')
        .set(data)
        .where(applyFilters({ id: data.id }))
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to update class type', result);
        return new Error('Failed to update class type');
      }

      return;
    } catch (error) {
      console.error('Error updating class type:', error);
      return new Error('Failed to update class type');
    }
  }

  async delete({ filters, trx }: DeleteClassTypeCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .deleteFrom('class_types')
        .where(applyFilters(filters))
        .execute();

      return;
    } catch (error) {
      console.error('Error deleting class type:', error);
      return new Error('Failed to delete class type');
    }
  }
}
