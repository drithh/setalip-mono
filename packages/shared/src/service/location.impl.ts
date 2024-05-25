import type {
  InsertLocation,
  LocationRepository,
  SelectDetailLocation,
  SelectLocation,
  UpdateLocation,
} from '#dep/repository/location';
import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { LocationService } from './location';

@injectable()
export class LocationServiceImpl implements LocationService {
  private _locationRepository: LocationRepository;

  constructor(
    @inject(TYPES.LocationRepository) locationRepository: LocationRepository
  ) {
    this._locationRepository = locationRepository;
  }

  async getLocations() {
    const locations = await this._locationRepository.getLocations();

    return {
      result: locations,
      error: undefined,
    };
  }

  async findLocationById(id: SelectLocation['id']) {
    const location = await this._locationRepository.findLocationById(id);

    if (!location) {
      return {
        error: new Error('Location not found'),
      };
    }

    return {
      result: location,
    };
  }

  async updateLocation(data: UpdateLocation) {
    // todo timezone
    const result = await this._locationRepository.updateLocation(data);

    return {
      result,
      error: undefined,
    };
  }

  async createLocationAsset(data: InsertLocation['assets']) {
    const result = await this._locationRepository.insertLocationAsset(data);

    if (!result.numInsertedOrUpdatedRows) {
      return {
        error: new Error('Failed to create location asset'),
      };
    }

    return {
      result,
      error: undefined,
    };
  }

  async deleteLocationAsset(id: SelectDetailLocation['assets'][0]['id']) {
    const result = await this._locationRepository.deleteLocationAsset(id);

    if (!result.numDeletedRows) {
      return {
        error: new Error('Failed to delete location asset'),
      };
    }

    return {
      result,
      error: undefined,
    };
  }

  async deleteFacilityImage(id: SelectDetailLocation['facilities'][0]['id']) {
    const result = await this._locationRepository.deleteFacilityImage(id);

    if (!result.numUpdatedRows) {
      return {
        error: new Error('Failed to delete facility image'),
      };
    }

    return {
      result,
      error: undefined,
    };
  }
}
