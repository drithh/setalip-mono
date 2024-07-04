import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllPackageOptions,
  FindAllUserPackageOption,
  InsertPackage,
  PackageRepository,
  SelectClassType,
  SelectPackage,
  SelectPackageTransaction,
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

  async findAll(data: FindAllPackageOptions) {
    const packages = await this._packageRepository.findAll(data);

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

  async findAllPackageTransactionByUserId(data: FindAllUserPackageOption) {
    const packages =
      await this._packageRepository.findAllPackageTransactionByUserId(data);

    return {
      result: packages,
      error: undefined,
    };
  }

  async findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ) {
    const packages =
      await this._packageRepository.findAllActivePackageByUserId(user_id);

    return {
      result: packages,
      error: undefined,
    };
  }

  async findAboutToExpiredPackage(
    user_id: SelectPackageTransaction['user_id'],
    class_type: SelectClassType['id']
  ) {
    const singlePackage =
      await this._packageRepository.findAboutToExpiredPackage(
        user_id,
        class_type
      );

    return {
      result: singlePackage,
      error: undefined,
    };
  }

  async findPackageTransactionUniqueCode(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ) {
    const uniqueCode =
      await this._packageRepository.findPackageTransactionUniqueCode(
        user_id,
        package_id
      );

    return {
      result: uniqueCode,
      error: undefined,
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
