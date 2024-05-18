import type {
  LocationRepository,
  SelectLocation,
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

  async getLocationById(id: SelectLocation['id']) {
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
}
