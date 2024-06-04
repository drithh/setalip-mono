import { Database, LocationOperationalHours, Otp } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  InsertFacility,
  InsertLocation,
  InsertLocationAsset,
  LocationRepository,
  SelectDetailLocation,
  SelectFacility,
  SelectLocation,
  SelectLocationAsset,
  SelectLocationWithAsset,
  UpdateFacility,
  UpdateLocation,
  UpdateOperationalHours,
} from '../location';
import { Insertable, Updateable, sql } from 'kysely';
import { OptionalToRequired } from '..';
@injectable()
export class KyselyMySqlLocationRepository implements LocationRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(): Promise<SelectLocationWithAsset[]> {
    const locationWithAssets = await this._db
      .selectFrom('locations')
      .leftJoin(
        'location_assets',
        'location_assets.location_id',
        'locations.id'
      )
      .select([
        'locations.id',
        'locations.name',
        'locations.email',
        'locations.address',
        'locations.phone_number',
        'locations.created_at',
        'locations.updated_at',
        'locations.updated_by',
        'locations.link_maps',
        'locations.deleted_at',
        sql<number>`MIN(location_assets.id)`.as('asset_id'),
        'location_assets.url as asset_url',
        'location_assets.name as asset_name',
      ])
      .where('locations.deleted_at', 'is', null)
      .groupBy('locations.id')
      .execute();

    console.log('locationWithAssets', locationWithAssets);

    return locationWithAssets;
  }

  async findById(
    id: SelectDetailLocation['id']
  ): Promise<SelectDetailLocation | undefined> {
    const locations = await this._db
      .selectFrom('locations')
      .selectAll()
      .where('locations.id', '=', id)
      .where('locations.deleted_at', 'is', null)
      .executeTakeFirst();

    if (!locations) {
      return undefined;
    }

    const assets = await this._db
      .selectFrom('location_assets')
      .selectAll()
      .where('location_assets.location_id', '=', id)
      .execute();

    const facilities = await this._db
      .selectFrom('location_facilities')
      .selectAll()
      .where('location_facilities.location_id', '=', id)
      .where('location_facilities.deleted_at', 'is', null)
      .execute();

    const operationalHours = await this._db
      .selectFrom('location_operational_hours')
      .selectAll()
      .where('location_operational_hours.location_id', '=', id)
      .execute();

    const location = {
      ...locations,
      assets,
      facilities,
      operational_hours: operationalHours,
    };

    return location;
  }

  async findAllFacilityById(
    id: SelectLocation['id']
  ): Promise<SelectFacility[]> {
    const facilities = await this._db
      .selectFrom('location_facilities')
      .selectAll()
      .where('location_facilities.location_id', '=', id)
      .where('location_facilities.deleted_at', 'is', null)
      .execute();

    return facilities;
  }

  create(data: InsertLocation): Promise<SelectLocation> {
    throw new Error('Method not implemented.');
  }

  async createAsset(data: InsertLocationAsset[]) {
    try {
      const query = this._db
        .insertInto('location_assets')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Error creating location asset:', result);
        return new Error('Failed to create location asset');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating location asset:', error);
      return new Error('Failed to create location asset');
    }
  }

  async createFacility(data: InsertFacility) {
    try {
      const query = this._db
        .insertInto('location_facilities')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);
      if (result.rows[0] === undefined) {
        console.error('Error creating facility:', result);
        return new Error('Failed to create facility');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error creating facility:', error);
      return new Error('Failed to create facility');
    }
  }

  async update(data: UpdateLocation) {
    try {
      const query = await this._db
        .updateTable('locations')
        .set(data)
        .where('locations.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error updating location:', query);
        return new Error('Failed to update location');
      }

      return;
    } catch (error) {
      console.error('Error updating location:', error);
      return new Error('Failed to update location');
    }
  }

  async updateFacility(data: UpdateFacility) {
    try {
      const query = await this._db
        .updateTable('location_facilities')
        .set(data)
        .where('location_facilities.id', '=', data.id)
        .executeTakeFirst();
      if (query.numUpdatedRows === undefined) {
        console.error('Error updating facility:', query);
        return new Error('Failed to update facility');
      }
      return;
    } catch (error) {
      console.error('Error updating facility:', error);
      return new Error('Failed to update facility');
    }
  }

  async updateOperationalHours({
    location_id,
    operationalHours,
  }: UpdateOperationalHours) {
    try {
      const currentOperationalHours = await this._db
        .selectFrom('location_operational_hours')
        .selectAll()
        .where('location_operational_hours.location_id', '=', location_id)
        .execute();

      // if in data there is no in currentOperationalHours, delete it
      const toDelete = currentOperationalHours.filter(
        (current) => !operationalHours.find((d) => d.id === current.id)
      );

      // if data not have id, insert it
      const toInsert = operationalHours.filter(
        (d) => !d.id
      ) as Insertable<LocationOperationalHours>[];

      // if data have id, update it
      const toUpdate = operationalHours.filter(
        (d) => d.id
      ) as OptionalToRequired<Updateable<LocationOperationalHours>, 'id'>[];

      await this._db.transaction().execute(async (trx) => {
        await Promise.all(
          toDelete.map((d) =>
            trx
              .deleteFrom('location_operational_hours')
              .where('location_operational_hours.id', '=', d.id)
              .execute()
          )
        );

        await Promise.all(
          toInsert.map((d) =>
            trx.insertInto('location_operational_hours').values(d).execute()
          )
        );

        await Promise.all(
          toUpdate.map((d) =>
            trx
              .updateTable('location_operational_hours')
              .set(d)
              .where('location_operational_hours.id', '=', d.id)
              .execute()
          )
        );
      });
      return;
    } catch (error) {
      console.error('Error updating operational hours:', error);
      return new Error('Failed to update operational hours');
    }
  }

  async delete(id: SelectDetailLocation['id']): Promise<undefined | Error> {
    try {
      const query = await this._db
        .updateTable('locations')
        .set({ deleted_at: new Date() })
        .where('locations.id', '=', id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error deleting location:', query);
        return new Error('Failed to delete location');
      }

      return;
    } catch (error) {
      console.error('Error deleting location:', error);
      return new Error('Failed to delete location');
    }
  }

  async deleteAsset(id: SelectLocationAsset['id']) {
    try {
      const query = await this._db
        .deleteFrom('location_assets')
        .where('location_assets.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Error deleting location asset:', query);
        return new Error('Failed to delete location asset');
      }

      return;
    } catch (error) {
      console.error('Error deleting location asset:', error);
      return new Error('Failed to delete location asset');
    }
  }

  async deleteFacility(id: SelectFacility['id']) {
    try {
      const query = await this._db
        .updateTable('location_facilities')
        .set({ deleted_at: new Date() })
        .where('location_facilities.id', '=', id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error deleting facility image:', query);
        return new Error('Failed to delete facility');
      }

      return;
    } catch (error) {
      console.error('Error deleting facility image:', error);
      return new Error('Failed to delete facility');
    }
  }
}
