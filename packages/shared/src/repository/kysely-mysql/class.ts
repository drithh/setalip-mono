import { inject, injectable } from 'inversify';
import {
  FindAllClassOptions,
  InsertClass,
  ClassRepository,
  SelectClass,
  UpdateClass,
} from '../class';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';

@injectable()
export class KyselyMySqlClassRepository implements ClassRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(data: FindAllClassOptions) {
    const { page = 1, perPage = 10, sort } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectClass} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('classes');

    // if (name) {
    //   query = query.where('name', 'like', `%${name}%`);
    // }
    // if (types) {
    //   query = query.where('class_type_id', 'in', types);
    // }
    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  findById(id: SelectClass['id']) {
    return this._db
      .selectFrom('classes')
      .selectAll()
      .where('classes.id', '=', id)
      .executeTakeFirst();
  }

  findAllLocationById(id: SelectClass['id']) {
    return this._db
      .selectFrom('locations')
      .innerJoin(
        'class_locations',
        'locations.id',
        'class_locations.location_id'
      )
      .selectAll('locations')
      .where('class_locations.class_id', '=', id)
      .execute();
  }

  async create(data: InsertClass) {
    try {
      const query = this._db
        .insertInto('classes')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create class', result);
        return new Error('Failed to create class');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating class:', error);
      return new Error('Failed to create class');
    }
  }

  async update(data: UpdateClass) {
    try {
      const query = await this._db
        .updateTable('classes')
        .set(data)
        .where('classes.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update class', query);
        return new Error('Failed to update class');
      }

      return;
    } catch (error) {
      console.error('Error updating class:', error);
      return new Error('Failed to update class');
    }
  }

  async delete(id: SelectClass['id']) {
    try {
      const query = this._db
        .deleteFrom('classes')
        .where('classes.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete class', result);
        return new Error('Failed to delete class');
      }

      return;
    } catch (error) {
      console.error('Error deleting class:', error);
      return new Error('Failed to delete class');
    }
  }
}
