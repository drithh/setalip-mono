import { inject, injectable } from 'inversify';
import {
  FindAllPackageOptions,
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
