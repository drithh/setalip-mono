import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { injectable, inject } from 'inversify';
import { LocationRepository } from '../location';
import {
  ClassTypeRepository,
  InsertClassType,
  SelectClassType,
  UpdateClassType,
} from '..';

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

  async findAll() {
    return this._db.selectFrom('class_types').selectAll().execute();
  }

  async findById(id: SelectClassType['id']) {
    return this._db
      .selectFrom('class_types')
      .selectAll()
      .where('class_types.id', '=', id)
      .executeTakeFirst();
  }

  async create(data: InsertClassType) {
    try {
      const query = this._db
        .insertInto('class_types')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

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

  async update(data: UpdateClassType) {
    try {
      const query = this._db
        .updateTable('class_types')
        .set(data)
        .where('class_types.id', '=', data.id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

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

  async delete(id: SelectClassType['id']) {
    try {
      const query = this._db
        .deleteFrom('class_types')
        .where('class_types.id', '=', id)
        .execute();

      return;
    } catch (error) {
      console.error('Error deleting class type:', error);
      return new Error('Failed to delete class type');
    }
  }
}
