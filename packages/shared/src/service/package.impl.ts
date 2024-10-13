import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  ClassTypeRepository,
  FindAllPackageOptions,
  FindAllUserPackageOption,
  FindAllUserPackageTransactionOption,
  InsertPackage,
  InsertPackageTransaction,
  LoyaltyRepository,
  PackageRepository,
  SelectClassType,
  SelectPackage,
  SelectPackageTransaction,
  SelectPackageTransactionWithPackage,
  UpdatePackage,
  UpdatePackageTransaction,
  UpdatePackageTransactionImage,
  UserRepository,
  VoucherRepository,
  WebSettingRepository,
} from '../repository';
import { PackageService } from './package';
import { NotificationType, type NotificationService } from '../notification';
import { error } from 'console';
import { PromiseResult } from '../types';
import {
  createSelectQueryBuilder,
  Expression,
  expressionBuilder,
  ExpressionBuilder,
  SelectQueryBuilder,
  SqlBool,
} from 'kysely';
import { Database, db, DB, Packages } from '../db';

interface FindAllPackage extends SelectPackage {
  class_type: string;
}

@injectable()
export class PackageServiceImpl implements PackageService {
  private _packageRepository: PackageRepository;
  private _notificationService: NotificationService;
  private _userRepository: UserRepository;
  private _webSettingRepository: WebSettingRepository;
  private _classTypeRepository: ClassTypeRepository;
  private _voucherRepository: VoucherRepository;
  private _loyaltyRepository: LoyaltyRepository;

  constructor(
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.WebSettingRepository) websRepository: WebSettingRepository,
    @inject(TYPES.ClassTypeRepository) classTypeRepository: ClassTypeRepository,
    @inject(TYPES.VoucherRepository) voucherRepository: VoucherRepository,
    @inject(TYPES.LoyaltyRepository) loyaltyRepository: LoyaltyRepository
  ) {
    this._packageRepository = packageRepository;
    this._notificationService = notificationService;
    this._userRepository = userRepository;
    this._webSettingRepository = websRepository;
    this._classTypeRepository = classTypeRepository;
    this._voucherRepository = voucherRepository;
    this._loyaltyRepository = loyaltyRepository;
  }

  async findAll(data: FindAllPackageOptions) {
    const { page = 1, perPage = 10, sort, name, types, is_active } = data;

    const offset = (page - 1) * perPage;
    const orderBy = sort?.split(',').map((part) => {
      const [field, direction] = part.split('.');
      return `${field?.trim()} ${direction?.toLowerCase()}` as `${keyof SelectPackage} ${'asc' | 'desc'}`;
    }) ?? ['created_at desc'];

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'packages'>();
    if (name) {
      customFilters.push(eb('name', 'like', `%${name}%`));
    }
    if (types && types.length > 0) {
      customFilters.push(eb('class_type_id', 'in', types));
    }

    if (is_active !== undefined) {
      customFilters.push(eb('is_active', '=', is_active));
    }

    // function lateralJoinClassType<
    //   T extends SelectQueryBuilder<DB, 'packages', {}>,
    // >(
    //   qb: T
    // ): SelectQueryBuilder<DB, 'packages' | 'class_types', SelectClassType> {
    //   return qb
    //     .innerJoinLateral(
    //       (eb) =>
    //         eb
    //           .selectFrom('class_types')
    //           .selectAll()
    //           .whereRef('class_types.id', '=', 'packages.class_type_id')
    //           .as('class_types'),
    //       (join) => join.onTrue()
    //     )
    //     .selectAll();
    // }

    const packages =
      await this._packageRepository.findWithPagination<FindAllPackage>({
        customFilters: customFilters,
        withClassType: true,
        perPage: perPage,
        offset: offset,
        orderBy: orderBy,
      });

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

  async findById(id: SelectPackage['id']) {
    const singlePackage = await this._packageRepository.find({
      filters: { id },
      limit: 1,
    });

    if (singlePackage.length < 0) {
      return {
        error: new Error('Package not found'),
      };
    }

    return {
      result: singlePackage[0],
    };
  }

  async findAboutToExpired(
    user_id: SelectPackageTransaction['user_id'],
    class_type: SelectClassType['id']
  ) {
    const singlePackage = await this._packageRepository.findAboutToExpired(
      user_id,
      class_type
    );

    return {
      result: singlePackage,
      error: undefined,
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

  async findPackageTransactionById(
    id: SelectPackageTransaction['id']
  ): PromiseResult<SelectPackageTransactionWithPackage, Error> {
    const packageTransaction = await this._packageRepository.find({
      filters: { id },
      limit: 1,
    });

    if (packageTransaction.length < 0) {
      return {
        result: undefined,
        error: new Error('Package transaction not found'),
      };
    }

    return {
      result: packageTransaction[0],
      error: undefined,
    };
  }

  async findPackageTransactionByUserIdAndPackageId(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ) {
    const packageTransaction =
      await this._packageRepository.findPackageTransactionByUserIdAndPackageId(
        user_id,
        package_id
      );

    return {
      result: packageTransaction,
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

    if (!packageData.is_active) {
      return {
        error: new Error('Package is not active'),
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
            error: new Error('User already bought one time only package'),
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

    let dataWithDiscount = data;

    const isDiscount =
      packageData.discount_end_date &&
      packageData.discount_end_date > new Date();

    let reducedPrice = packageData.price;

    if (isDiscount) {
      const discount =
        reducedPrice * (packageData.discount_percentage ?? 0) * 0.01;

      dataWithDiscount.discount = discount;
      reducedPrice = reducedPrice - discount;
    }

    // verify voucher
    if (data.voucher_code) {
      const voucher = await this._voucherRepository.findByCodeAndUser({
        code: data.voucher_code,
        user_id: data.user_id,
      });
      if (voucher) {
        dataWithDiscount.voucher_id = voucher.id;

        if (voucher.type === 'percentage') {
          const voucherDiscount = reducedPrice * (1 - voucher.discount / 100);
          dataWithDiscount.voucher_discount = voucherDiscount;
          reducedPrice = voucherDiscount;
        } else {
          const voucherDiscount = voucher.discount;
          reducedPrice = reducedPrice - voucherDiscount;
          dataWithDiscount.voucher_discount = voucherDiscount;
        }
      }
    }

    dataWithDiscount.amount_paid = reducedPrice + data.unique_code;

    const result =
      await this._packageRepository.createPackageTransaction(dataWithDiscount);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserBoughtPackage,
        package: packageData.name,
        price: dataWithDiscount.amount_paid,
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

    if (!packageData.is_active) {
      return {
        result: undefined,
        error: new Error('Package is not active'),
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

    let dataWithDiscount = data;
    let reducedPrice =
      packageTransaction.amount_paid +
      (packageTransaction.voucher_discount ?? 0);
    // verify voucher
    if (data.voucher_code) {
      const voucher = await this._voucherRepository.findByCodeAndUser({
        code: data.voucher_code,
        user_id: user.id,
      });
      if (voucher) {
        dataWithDiscount.voucher_id = voucher.id;

        if (voucher.type === 'percentage') {
          const voucherDiscount = reducedPrice * (1 - voucher.discount / 100);
          dataWithDiscount.voucher_discount = voucherDiscount;
          reducedPrice = voucherDiscount;
        } else {
          const voucherDiscount = voucher.discount;
          reducedPrice = reducedPrice - voucherDiscount;
          dataWithDiscount.voucher_discount = voucherDiscount;
        }
      }
    } else {
      dataWithDiscount.voucher_id = packageTransaction.voucher_id;
    }

    dataWithDiscount.amount_paid = reducedPrice;
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

      // check whether user bought package for the first time
      const userPackage = await this._packageRepository.findAllPackageByUserId(
        user.id
      );

      if (userPackage.length === 0) {
        return {
          result: undefined,
        };
      }

      // loyalty
      const loyalty = await this._loyaltyRepository.createOnReward({
        reward_id: 5,
        user_id: user.id,
        note: `You bought ${packageData.name}`,
        reference_id: data.id,
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

  async updatePackageTransactionImage(data: UpdatePackageTransactionImage) {
    const result =
      await this._packageRepository.updatePackageTransactionImage(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: undefined,
    };
  }

  async delete(id: SelectPackage['id']) {
    const result = await this._packageRepository.delete({ filters: { id } });

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

  async deleteExpiredPackageTransaction() {
    const result = await this._packageRepository.deletePackageTransaction({
      filters: {},
    });

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
