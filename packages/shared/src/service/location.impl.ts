import type {
  InsertFacility,
  InsertLocation,
  InsertLocationAsset,
  LocationRepository,
  SelectDetailLocation,
  SelectFacility,
  SelectLocation,
  SelectLocationAsset,
  UpdateFacility,
  UpdateLocation,
  UpdateOperationalHours,
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

  async findAll() {
    const locations = await this._locationRepository.findAll();

    return {
      result: locations,
      error: undefined,
    };
  }

  async findById(id: SelectLocation['id']) {
    const location = await this._locationRepository.findById(id);

    if (!location) {
      return {
        error: new Error('Location not found'),
      };
    }

    return {
      result: location,
    };
  }

  async createFacility(data: InsertFacility) {
    const result = await this._locationRepository.createFacility(data);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to create facility'),
      };
    }

    return {
      result,
    };
  }

  async createAsset(data: InsertLocationAsset[]) {
    const result = await this._locationRepository.createAsset(data);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to create location asset', result),
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateLocation) {
    // todo timezone
    const result = await this._locationRepository.update(data);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to update location', result),
      };
    }

    return {
      result,
    };
  }

  async updateFacility(data: UpdateFacility) {
    const result = await this._locationRepository.updateFacility(data);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to update facility', result),
      };
    }

    return {
      result,
    };
  }

  async updateOperationalHour(data: UpdateOperationalHours) {
    const result = await this._locationRepository.updateOperationalHours(data);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to update operational hours', result),
      };
    }

    return {
      result,
    };
  }

  async deleteAsset(id: SelectLocationAsset['id']) {
    const result = await this._locationRepository.deleteAsset(id);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to delete location asset'),
      };
    }

    return {
      result,
    };
  }

  async deleteFacilityImage(id: SelectFacility['id']) {
    const result = await this._locationRepository.deleteFacilityImage(id);

    if (result instanceof Error) {
      return {
        error: new Error('Failed to delete facility image', result),
      };
    }

    return {
      result,
    };
  }
}
