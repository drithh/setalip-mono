import { inject, injectable } from 'inversify';
import {
  FindAllOptions,
  InsertPackage,
  PackageRepository,
  SelectPackage,
  UpdatePackage,
} from '../package';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';

@injectable()
export class KyselyMySqlPackageRepository implements PackageRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(data: FindAllOptions) {
    const { page, perPage, sort, name, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['createdAt', 'desc']
    ).join(' ') as `${keyof SelectPackage} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('packages');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    if (types) {
      query = query.where('class_type_id', 'in', types);
    }
    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();
    return {
      data: queryData,
      pageCount: queryCount?.count ?? -1,
    };
  }

  findById(id: SelectPackage['id']) {
    return this._db
      .selectFrom('packages')
      .selectAll()
      .where('packages.id', '=', id)
      .executeTakeFirst();
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

  async update(data: UpdatePackage) {
    try {
      const query = this._db
        .updateTable('packages')
        .set(data)
        .where('packages.id', '=', data.id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to update package', result);
        return new Error('Failed to update package');
      }

      return;
    } catch (error) {
      console.error('Error updating package:', error);
      return new Error('Failed to update package');
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
