import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  InsertPackage,
  PackageRepository,
  SelectPackage,
  UpdatePackage,
} from '../repository';
import { PackageService } from './package';

@injectable()
export class PackageServiceImpl implements PackageService {
  private _packageRepository: PackageRepository;

  constructor(
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository
  ) {
    this._packageRepository = packageRepository;
  }

  async findAll() {
    const packages = await this._packageRepository.findAll();

    return {
      result: packages,
      error: undefined,
    };
  }

  async findById(id: SelectPackage['id']) {
    const singlePackage = await this._packageRepository.findById(id);

    if (!singlePackage) {
      return {
        error: new Error('Package not found'),
      };
    }

    return {
      result: singlePackage,
    };
  }

  async create(data: InsertPackage) {
    const result = await this._packageRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdatePackage) {
    const result = await this._packageRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async delete(id: SelectPackage['id']) {
    const result = await this._packageRepository.delete(id);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }
}
