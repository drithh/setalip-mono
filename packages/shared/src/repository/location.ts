import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import {
  Locations,
  LocationAssets,
  LocationFacilities,
  LocationOperationalHours,
  FacilityEquipments,
} from '../db';
import { OptionalToRequired } from '.';

export interface SelectLocation extends Selectable<Locations> {
  assets: Selectable<LocationAssets>[];
}

export interface SelectDetailLocation extends SelectLocation {
  facilities: Selectable<LocationFacilities>[];
  operational_hours: Selectable<LocationOperationalHours>[];
}

export interface InsertLocation extends Insertable<Locations> {
  assets: Insertable<LocationAssets>[];
  facilities: Insertable<LocationFacilities>[];
  operational_hours: Insertable<LocationOperationalHours>[];
}

export type InsertFacility = Insertable<LocationFacilities>;
export interface UpdateLocation
  extends OptionalToRequired<Updateable<Locations>, 'id'> {}

export interface UpdateFacility
  extends OptionalToRequired<Updateable<LocationFacilities>, 'id'> {}

export interface UpdateOperationalHours {
  location_id: Selectable<LocationOperationalHours>['location_id'];
  data: Updateable<LocationOperationalHours>[];
}

export interface LocationRepository {
  getLocations(): Promise<SelectLocation[]>;
  findLocationById(
    id: SelectLocation['id']
  ): Promise<SelectDetailLocation | undefined>;
  createLocation(data: InsertLocation): Promise<InsertResult>;
  createLocationAsset(data: InsertLocation['assets']): Promise<InsertResult>;
  createFacility(data: InsertFacility): Promise<InsertResult>;
  updateLocation(data: UpdateLocation): Promise<UpdateResult>;
  updateFacility(data: UpdateFacility): Promise<UpdateResult>;
  updateOperationalHours(data: UpdateOperationalHours): Promise<boolean>;
  deleteLocationAsset(
    id: SelectDetailLocation['assets'][0]['id']
  ): Promise<DeleteResult>;
  deleteLocation(id: SelectLocation['id']): Promise<DeleteResult>;
  deleteFacilityImage(
    id: SelectDetailLocation['facilities'][0]['id']
  ): Promise<UpdateResult>;
}
