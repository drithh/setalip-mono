import { inject, injectable } from 'inversify';
import {
  FindAllClassOptions,
  InsertClass,
  ClassRepository,
  SelectClass,
  UpdateClass,
  SelectDetailClassAssetAndLocation,
} from '../class';
import { ClassAssets, Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { Selectable, sql } from 'kysely';

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

  async findAllClassWithAsset(data: FindAllClassOptions) {
    const { page = 1, perPage = 10, sort } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['classes.created_at', 'desc']
    ).join(' ') as `${keyof SelectClass} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('classes')
      .leftJoin('class_assets', 'classes.id', 'class_assets.class_id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id');

    // if (name) {
    //   query = query.where('name', 'like', `%${name}%`);
    // }
    // if (types) {
    //   query = query.where('class_type_id', 'in', types);
    // }
    const queryData = await query
      .select((eb) => [
        'classes.id',
        'classes.name',
        'classes.duration',
        'classes.description',
        'classes.slot',
        'classes.class_type_id',
        'classes.created_at',
        eb.fn.max('class_assets.url').as('asset'),
        eb.fn.max('class_assets.name').as('asset_name'),
        'class_types.type as class_type',
      ])
      .groupBy(['classes.id', 'class_type'])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('classes.id').as('count')])
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

  findDetailClassAssetAndLocation(id: SelectClass['id']) {
    return this._db
      .selectFrom('classes')
      .selectAll('classes')
      .where('classes.id', '=', id)
      .leftJoin('class_assets', 'classes.id', 'class_assets.class_id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .select((eb) => [
        'class_types.type as class_type',
        eb
          .selectFrom('class_assets')
          .select(
            sql<
              SelectDetailClassAssetAndLocation['asset']
            >`coalesce(json_arrayagg(json_object('name', class_assets.name, 'url', class_assets.url, 'type', class_assets.type)), '[]')`.as(
              'asset'
            )
          )
          .whereRef('class_assets.class_id', '=', 'classes.id')
          .as('asset'),
        eb
          .selectFrom('class_locations')
          .innerJoin('locations', 'locations.id', 'class_locations.location_id')
          .select(
            sql<
              SelectDetailClassAssetAndLocation['locations']
            >`coalesce(json_arrayagg(json_object('name', locations.name)), '[]')`.as(
              'locations'
            )
          )
          .whereRef('class_locations.class_id', '=', 'classes.id')
          .as('locations'),
      ])
      .executeTakeFirst();
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
