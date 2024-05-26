import {
  InsertFacility,
  InsertLocation,
  SelectDetailLocation,
  SelectLocation,
  UpdateFacility,
  UpdateLocation,
  UpdateOperationalHours,
} from '#dep/repository/location';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import type { ErrorFields, PromiseResult } from '../types';

export interface LocationService {
  getLocations(): PromiseResult<SelectLocation[], Error>;
  findLocationById(
    id: SelectLocation['id']
  ): PromiseResult<SelectDetailLocation, Error>;
  createFacility(data: InsertFacility): PromiseResult<InsertResult, Error>;
  createLocationAsset(
    data: InsertLocation['assets']
  ): PromiseResult<InsertResult, Error>;

  updateLocation(data: UpdateLocation): PromiseResult<UpdateResult, Error>;
  updateFacility(data: UpdateFacility): PromiseResult<UpdateResult, Error>;
  updateOperationalHour(
    data: UpdateOperationalHours
  ): PromiseResult<boolean, Error>;
  deleteLocationAsset(
    id: SelectDetailLocation['assets'][0]['id']
  ): PromiseResult<DeleteResult, Error>;
  deleteFacilityImage(
    id: SelectDetailLocation['facilities'][0]['id']
  ): PromiseResult<string, Error>;
}
