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

export type SelectLocation = Selectable<Locations>;
export type SelectLocationAsset = Selectable<LocationAssets>;
export type SelectFacility = Selectable<LocationFacilities>;
export type SelectOperationalHour = Selectable<LocationOperationalHours>;

export interface SelectDetailLocation extends SelectLocation {
  assets: SelectLocationAsset[];
  facilities: SelectFacility[];
  operational_hours: SelectOperationalHour[];
}

export type InsertLocation = Insertable<Locations>;
export type InsertLocationAsset = Insertable<LocationAssets>;
export type InsertFacility = Insertable<LocationFacilities>;
export type InsertOperationalHours = Insertable<LocationOperationalHours>;

export type UpdateLocation = OptionalToRequired<Updateable<Locations>, 'id'>;
export type UpdateFacility = OptionalToRequired<
  Updateable<LocationFacilities>,
  'id'
>;

export interface UpdateOperationalHours {
  location_id: Selectable<LocationOperationalHours>['location_id'];
  data: Updateable<LocationOperationalHours>[];
}

export type SelectLocationWithAsset = SelectLocation & {
  asset_id: SelectLocationAsset['id'] | null;
  asset_name: SelectLocationAsset['name'] | null;
  asset_url: SelectLocationAsset['url'] | null;
};

export interface LocationRepository {
  findAll(): Promise<SelectLocationWithAsset[]>;
  findById(id: SelectLocation['id']): Promise<SelectDetailLocation | undefined>;

  create(data: InsertLocation): Promise<SelectLocation | Error>;
  createAsset(
    data: InsertLocationAsset[]
  ): Promise<SelectLocationAsset | Error>;
  createFacility(data: InsertFacility): Promise<SelectFacility | Error>;

  update(data: UpdateLocation): Promise<undefined | Error>;
  updateFacility(data: UpdateFacility): Promise<undefined | Error>;
  updateOperationalHours(
    data: UpdateOperationalHours
  ): Promise<undefined | Error>;

  delete(id: SelectLocation['id']): Promise<undefined | Error>;
  deleteAsset(id: SelectLocationAsset['id']): Promise<undefined | Error>;
  deleteFacilityImage(id: SelectFacility['id']): Promise<undefined | Error>;
}
