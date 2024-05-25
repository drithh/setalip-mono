import { Database, Otp } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  InsertLocation,
  LocationRepository,
  SelectDetailLocation,
  SelectLocation,
  UpdateLocation,
} from '../location';
import { DeleteResult, InsertResult } from 'kysely';
import { UpdateResult } from 'kysely';

@injectable()
export class KyselyMySqlLocationRepository implements LocationRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findLocationById(
    id: SelectDetailLocation['id']
  ): Promise<SelectDetailLocation | undefined> {
    const locations = await this._db
      .selectFrom('locations')
      .selectAll()
      .where('locations.id', '=', id)
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
      .execute();

    const openingHours = await this._db
      .selectFrom('location_opening_hours')
      .selectAll()
      .where('location_opening_hours.location_id', '=', id)
      .execute();

    const location = {
      ...locations,
      assets,
      facilities: facilities,
      openingHours,
    };

    return location;
  }

  async getLocations(): Promise<SelectLocation[]> {
    const locations = await this._db
      .selectFrom('locations')
      .selectAll()
      .execute();

    const result = await Promise.all(
      locations.map(async (location) => {
        const assets = await this._db
          .selectFrom('location_assets')
          .selectAll()
          .where('location_assets.location_id', '=', location.id)
          .execute();

        return {
          ...location,
          assets,
        };
      })
    );

    return result;
  }

  createLocation(data: InsertLocation): Promise<InsertResult> {
    throw new Error('Method not implemented.');
  }

  updateLocation(data: UpdateLocation): Promise<UpdateResult> {
    return this._db
      .updateTable('locations')
      .set(data)
      .where('locations.id', '=', data.id)
      .executeTakeFirst();
  }

  insertLocationAsset(data: InsertLocation['assets']): Promise<InsertResult> {
    return this._db
      .insertInto('location_assets')
      .values(data)
      .executeTakeFirst();
  }

  deleteLocationAsset(
    id: SelectDetailLocation['assets'][0]['id']
  ): Promise<DeleteResult> {
    return this._db
      .deleteFrom('location_assets')
      .where('location_assets.id', '=', id)
      .executeTakeFirst();
  }

  deleteLocation(id: SelectDetailLocation['id']): Promise<DeleteResult> {
    throw new Error('Method not implemented.');
  }

  deleteFacilityImage(
    id: SelectDetailLocation['facilities'][0]['id']
  ): Promise<UpdateResult> {
    return this._db
      .updateTable('location_facilities')
      .set({ image_url: null })
      .where('location_facilities.id', '=', id)
      .executeTakeFirst();
  }
}
