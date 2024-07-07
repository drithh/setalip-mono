import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  ClassTypeRepository,
  FindAllPackageOptions,
  FindAllUserPackageOption,
  FindAllUserPackageTransactionOption,
  InsertPackage,
  InsertPackageTransaction,
  PackageRepository,
  SelectClassType,
  SelectPackage,
  SelectPackageTransaction,
  UpdatePackage,
  UpdatePackageTransaction,
  UserRepository,
  WebSettingRepository,
} from '../repository';
import { PackageService } from './package';
import { NotificationType, type NotificationService } from '../notification';

@injectable()
export class PackageServiceImpl implements PackageService {
  private _packageRepository: PackageRepository;
  private _notificationService: NotificationService;
  private _userRepository: UserRepository;
  private _webSettingRepository: WebSettingRepository;
  private _classTypeRepository: ClassTypeRepository;

  constructor(
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.WebSettingRepository) websRepository: WebSettingRepository,
    @inject(TYPES.ClassTypeRepository) classTypeRepository: ClassTypeRepository
  ) {
    this._packageRepository = packageRepository;
    this._notificationService = notificationService;
    this._userRepository = userRepository;
    this._webSettingRepository = websRepository;
    this._classTypeRepository = classTypeRepository;
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

  async findAllPackageTransaction(data: FindAllUserPackageTransactionOption) {
    const packages =
      await this._packageRepository.findAllPackageTransaction(data);

    return {
      result: packages,
      error: undefined,
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

  async createPackageTransaction(data: InsertPackageTransaction) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    const packageData = await this._packageRepository.findById(data.package_id);

    if (!packageData) {
      return {
        error: new Error('Package not found'),
      };
    }

    if (packageData.one_time_only) {
      const userPackage = await this._packageRepository.findAllPackageByUserId(
        data.user_id
      );

      // iterate through userPackage to check if user already have the same package
      for (const userPackageData of userPackage) {
        if (userPackageData.package_id === data.package_id) {
          return {
            error: new Error('User already have the same package'),
          };
        }
      }
    }

    const depositAccount =
      await this._webSettingRepository.findDepositAccountById(
        data.deposit_account_id
      );

    if (!depositAccount) {
      return {
        error: new Error('Deposit account not found'),
      };
    }

    const result = await this._packageRepository.createPackageTransaction(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserBoughtPackage,
        package: packageData.name,
        deposit_account_account_number: depositAccount.account_number,
        deposit_account_name: depositAccount.name,
        deposit_account_bank_name: depositAccount.bank_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
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

  async updatePackageTransaction(data: UpdatePackageTransaction) {
    const packageTransaction =
      await this._packageRepository.findPackageTransactionById(data.id);

    if (!packageTransaction || !packageTransaction.deposit_account_id) {
      return {
        result: undefined,
        error: new Error('Package transaction not found'),
      };
    }

    const user = await this._userRepository.findById(
      packageTransaction.user_id
    );

    if (!user) {
      return {
        result: undefined,
        error: new Error('User not found'),
      };
    }

    const packageData = await this._packageRepository.findById(
      packageTransaction.package_id
    );

    if (!packageData) {
      return {
        result: undefined,
        error: new Error('Package not found'),
      };
    }

    const classTypes = await this._classTypeRepository.findById(
      packageData.class_type_id
    );

    if (!classTypes) {
      return {
        result: undefined,
        error: new Error('Class type not found'),
      };
    }

    const depositAccount =
      await this._webSettingRepository.findDepositAccountById(
        packageTransaction.deposit_account_id
      );

    if (!depositAccount) {
      return {
        result: undefined,
        error: new Error('Deposit account not found'),
      };
    }

    const result = await this._packageRepository.updatePackageTransaction(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    if (result.status === 'completed') {
      const notification = await this._notificationService.sendNotification({
        payload: {
          type: NotificationType.AdminConfirmedUserPackage,
          package: packageData.name,
          credit: result.credit,
          status: result.status,
          expired_at: result.expired_at,
          class_type: classTypes.type,
        },
        recipient: user.phone_number,
      });

      if (notification.error) {
        return {
          result: undefined,
          error: notification.error,
        };
      }
    }

    return {
      result: undefined,
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
