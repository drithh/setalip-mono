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
  UpdateClassType,
  UpdateClassTypeCommand,
} from '..';
import { entriesFromObject } from '#dep/util/index';
import { ExpressionBuilder } from 'kysely';

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
  private compileFilters(filters: Partial<SelectClassType>) {
    return (eb: ExpressionBuilder<DB, 'class_types'>) => {
      const compiledFilters = entriesFromObject(filters).flatMap(
        ([key, value]) => (value !== undefined ? eb(key, '=', value) : [])
      );
      return eb.and(compiledFilters);
    };
  }

  async find(data?: SelectClassTypeQuery) {
    let baseQuery = this._db.selectFrom('class_types');

    if (data?.filters) {
      baseQuery = baseQuery.where(this.compileFilters(data.filters));
    }

    if (data?.orderBy) {
      baseQuery = baseQuery.orderBy(data.orderBy);
    }

    if (data?.offset) {
      baseQuery = baseQuery.offset(data.offset);
    }

    return baseQuery.selectAll().execute();
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
        .where('class_types.id', '=', data.id)
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
        .where(this.compileFilters(filters))
        .execute();

      return;
    } catch (error) {
      console.error('Error deleting class type:', error);
      return new Error('Failed to delete class type');
    }
  }
}
