import { SelectDetailLocation, SelectLocation } from '#dep/repository/location';
import type { ErrorFields, PromiseResult } from '../types';

export interface LocationService {
  getLocations(): PromiseResult<SelectLocation[], Error>;
  findLocationById(
    id: SelectLocation['id']
  ): PromiseResult<SelectDetailLocation, Error>;
  // createLocation(data: InsertLocation): PromiseResult<InsertResult, Error>;
  // updateLocation(data: UpdateLocation): PromiseResult<UpdateResult, Error>;
  // deleteLocation(id: SelectLocation['id']): PromiseResult<DeleteResult, Error>;
}
