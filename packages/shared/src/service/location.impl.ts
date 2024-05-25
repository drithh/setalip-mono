import type {
  InsertLocation,
  LocationRepository,
  SelectDetailLocation,
  SelectLocation,
  UpdateFacility,
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

  async createLocationAsset(data: InsertLocation['assets']) {
    const result = await this._locationRepository.createLocationAsset(data);

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

  async updateLocation(data: UpdateLocation) {
    // todo timezone
    const result = await this._locationRepository.updateLocation(data);

    return {
      result,
      error: undefined,
    };
  }

  async updateFacility(data: UpdateFacility) {
    const result = await this._locationRepository.updateFacility(data);

    return {
      result,
      error: undefined,
    };
  }

  async deleteLocationAsset(id: SelectDetailLocation['assets'][0]['id']) {
    const result = await this._locationRepository.deleteLocationAsset(id);

    if (!Number(result.numDeletedRows)) {
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

    if (!Number(result.numUpdatedRows)) {
      return {
        error: new Error('Failed to delete facility image'),
      };
    }

    return {
      result: 'Selesai',
      error: undefined,
    };
  }
}
