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
  LocationOpeningHours,
  FacilityEquipments,
} from '../db';
import { OptionalToRequired } from '.';

export interface SelectLocation extends Selectable<Locations> {
  assets: Selectable<LocationAssets>[];
}

export interface SelectDetailLocation extends SelectLocation {
  facilities: Selectable<LocationFacilities>[];
  openingHours: Selectable<LocationOpeningHours>[];
}

export interface InsertLocation extends Insertable<Locations> {
  assets: Insertable<LocationAssets>[];
  facilities: Insertable<LocationFacilities>[];
  openingHours: Insertable<LocationOpeningHours>[];
}
export interface UpdateLocation
  extends OptionalToRequired<Updateable<Locations>, 'id'> {
  assets?: Insertable<LocationAssets>[];
  facilities?: Insertable<LocationFacilities>[];
  openingHours?: Insertable<LocationOpeningHours>[];
}

export interface LocationRepository {
  getLocations(): Promise<SelectLocation[]>;
  findLocationById(
    id: SelectLocation['id']
  ): Promise<SelectDetailLocation | undefined>;
  createLocation(data: InsertLocation): Promise<InsertResult>;
  updateLocation(data: UpdateLocation): Promise<UpdateResult>;
  deleteLocation(id: SelectLocation['id']): Promise<DeleteResult>;
}
