import {
  InsertFacility,
  InsertLocationAsset,
  SelectDetailLocation,
  SelectFacility,
  SelectLocation,
  SelectLocationAsset,
  SelectLocationWithAsset,
  UpdateFacility,
  UpdateLocation,
  UpdateOperationalHours,
} from '#dep/repository/location';
import type { PromiseResult } from '../types';

export interface LocationService {
  findAll(): PromiseResult<SelectLocationWithAsset[], Error>;
  findById(
    id: SelectLocation['id']
  ): PromiseResult<SelectDetailLocation, Error>;
  findAllFacilityById(
    id: SelectLocation['id']
  ): PromiseResult<SelectFacility[], Error>;

  createFacility(data: InsertFacility): PromiseResult<SelectFacility, Error>;
  createAsset(
    data: InsertLocationAsset[]
  ): PromiseResult<SelectLocationAsset, Error>;

  update(data: UpdateLocation): PromiseResult<void, Error>;
  updateFacility(data: UpdateFacility): PromiseResult<void, Error>;
  updateOperationalHour(
    data: UpdateOperationalHours
  ): PromiseResult<void, Error>;

  delete(id: SelectLocation['id']): PromiseResult<void, Error>;
  deleteAsset(id: SelectLocationAsset['id']): PromiseResult<void, Error>;
  deleteFacility(id: SelectFacility['id']): PromiseResult<void, Error>;
}
