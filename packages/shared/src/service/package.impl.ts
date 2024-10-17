import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';

import {
  SelectPackage__ClassType,
  FindAllPackageOptions,
  FindAllUserPackageActiveByUserId,
  FindAllUserPackageTransactionByUserIdOption,
  FindAllUserPackageTransactionOption,
  InsertPackageTransactionOption,
  PackageService,
  SelectPackageTransaction__Package__User__DepositAccount,
  SelectPackageTransaction__Package__UserPackage,
  UpdatePackageTransactionImage,
  UpdatePackageTransactionOption,
} from './package';
import { NotificationType, type NotificationService } from '../notification';
import { error } from 'console';
import { PromiseResult } from '../types';
import {
  createSelectQueryBuilder,
  Expression,
  expressionBuilder,
  ExpressionBuilder,
  SelectQueryBuilder,
  sql,
  SqlBool,
} from 'kysely';
import { Database, db, DB, Packages } from '../db';
import type {
  SelectPackageTransaction,
  PackageRepository,
  UserRepository,
  WebSettingRepository,
  ClassTypeRepository,
  VoucherRepository,
  LoyaltyRepository,
  SelectPackage,
  SelectUserPackage,
  SelectClassType,
  InsertPackage,
  InsertPackageTransaction,
  UpdatePackage,
  UpdatePackageTransaction,
  InsertPackageCommand,
} from '../repository';
import { addDays } from 'date-fns';
import { up } from '../../scripts/migrations/001-migrate';

interface FindAllPackageTransaction extends SelectPackageTransaction {
  user_name: string;
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

    const packages =
      await this._packageRepository.findWithPagination<SelectPackage__ClassType>(
        {
          customFilters: customFilters,
          perPage: perPage,
          offset: offset,
          // fix this
          orderBy: orderBy[0],
          withClassType: true,
        }
      );

    return {
      result: packages,
      error: undefined,
    };
  }

  async findById(id: SelectPackage['id']) {
    const singlePackage = await this._packageRepository.find({
      filters: { id },
      perPage: 1,
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

  /**
   * Finds all active user packages by the given user ID.
   *
   * @param user_id - The ID of the user whose active packages are to be found.
   * @returns An object containing the result of the query and any potential error.
   *
   * @remarks
   * This method applies custom filters to ensure that only active packages are retrieved.
   * It filters out packages that have expired and those where the credit is more than the sum of credit transactions.
   * The results are ordered by the expiration date in ascending order.
   *
   * @example
   * ```typescript
   * const userId = 'some-user-id';
   * const result = await findAllUserPackageActiveByUserId(userId);
   * console.log(result);
   * ```
   */
  async findAllUserPackageActiveByUserId(
    user_id: SelectUserPackage['user_id']
  ) {
    const packages =
      await this._packageRepository.findAllUserPackageActiveByUserId(user_id);

    return {
      result: packages,
      error: undefined,
    };
  }

  /**
   * Finds the expiring user package by user ID and class type ID.
   *
   * @param user_id - The ID of the user whose package is being searched.
   * @param class_type_id - The ID of the class type to filter the packages.
   * @returns An object containing either the found package or an error.
   *
   * @remarks
   * This method first retrieves all active packages for the given user ID.
   * If there is an error in retrieving the packages or no packages are found,
   * it returns an error. Otherwise, it searches for a package matching the
   * specified class type ID. If such a package is found, it is returned;
   * otherwise, an error indicating that the package was not found is returned.
   */
  async findUserPackageExpiringByUserId(
    user_id: SelectUserPackage['user_id'],
    class_type_id: SelectClassType['id']
  ) {
    const activePackages = await this.findAllUserPackageActiveByUserId(user_id);

    if (activePackages.error || !activePackages.result) {
      return {
        error: activePackages.error,
      };
    }

    const singlePackage = activePackages.result.find(
      (singlePackage) => singlePackage.class_type_id === class_type_id
    );

    if (!singlePackage) {
      return {
        error: new Error('Package not found'),
      };
    }

    return {
      result: singlePackage,
      error: undefined,
    };
  }

  async findAllPackageTransaction(data: FindAllUserPackageTransactionOption) {
    const { page = 1, perPage = 10, sort, user_name, status } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackageTransaction} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'package_transactions' | 'users'>();
    if (status && status.length > 0) {
      customFilters.push(eb('package_transactions.status', 'in', status));
    }
    if (user_name) {
      customFilters.push(eb('users.name', 'like', `%${user_name}%`));
    }

    const packages =
      await this._packageRepository.findPackageTransactionWithPagination<SelectPackageTransaction__Package__User__DepositAccount>(
        {
          customFilters: customFilters,
          perPage: perPage,
          offset: offset,
          orderBy: orderBy,
          withPackage: true,
          withUser: true,
          withDepositAccount: true,
        }
      );

    return {
      result: packages,
      error: undefined,
    };
  }

  async findAllPackageTransactionByUserId(
    data: FindAllUserPackageTransactionByUserIdOption
  ) {
    const { page = 1, perPage = 10, sort, user_id, status } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackageTransaction} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'package_transactions' | 'users'>();
    if (status && status.length > 0) {
      customFilters.push(eb('package_transactions.status', 'in', status));
    }

    const packages =
      await this._packageRepository.findPackageTransactionWithPagination<SelectPackageTransaction__Package__UserPackage>(
        {
          filters: { user_id },
          customFilters: customFilters,
          perPage: perPage,
          offset: offset,
          orderBy: orderBy,
          withPackage: true,
          withUserPackage: true,
        }
      );

    return {
      result: packages,
      error: undefined,
    };
  }

  async findPackageTransactionById(id: SelectPackageTransaction['id']) {
    const packageTransaction = (
      await this._packageRepository.findPackageTransaction<SelectPackageTransaction__Package__UserPackage>(
        {
          filters: { id },
          perPage: 1,
          withPackage: true,
          withUserPackage: true,
        }
      )
    )?.[0];

    if (!packageTransaction) {
      return {
        error: new Error('Package transaction not found'),
      };
    }

    return {
      result: packageTransaction,
    };
  }

  async findPackageTransactionByUserIdAndPackageId(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ) {
    const packageTransaction = (
      await this._packageRepository.findPackageTransaction({
        filters: { user_id, package_id },
        perPage: 1,
      })
    )?.[0];

    if (packageTransaction) {
      return {
        result: packageTransaction,
        error: undefined,
      };
    }
    const allPendingTransactions =
      await this._packageRepository.findPackageTransaction({
        filters: {
          status: 'pending',
        },
      });

    const uniqueCodes = new Set(
      allPendingTransactions.map((transaction) => transaction.unique_code)
    );

    let newUniqueCode;
    do {
      newUniqueCode = Math.floor(Math.random() * 100);
    } while (uniqueCodes.has(newUniqueCode));

    return {
      result: {
        user_id,
        package_id,
        unique_code: newUniqueCode,

        id: 0,
        deposit_account_id: null,
        discount: null,
        voucher_discount: null,
        user_package_id: null,
        voucher_id: null,

        status: 'pending' as const,
        image_url: null,
        credit: 0,
        amount_paid: 0,
        updated_by: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      error: undefined,
    };
  }

  async create({ data, trx }: InsertPackageCommand) {
    const result = await this._packageRepository.create({ data });

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async createPackageTransaction(data: InsertPackageTransactionOption) {
    if (
      data.deposit_account_id === null ||
      data.deposit_account_id === undefined
    ) {
      return {
        error: new Error('Deposit account id is required'),
      };
    }
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    const packageData = (
      await this._packageRepository.find({
        filters: { id: data.package_id },
      })
    )?.[0];

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
      const userPackage = await this._packageRepository.findUserPackage({
        filters: { user_id: data.user_id, package_id: packageData.id },
      });

      if (userPackage.length > 0) {
        return {
          error: new Error('User already bought one time only package'),
        };
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
    const result = await this._packageRepository.createPackageTransaction({
      data: {
        ...dataWithDiscount,
        status: 'pending',
        credit: packageData.credit + (packageData.discount_credit ?? 0),
      },
    });

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
    const result = await this._packageRepository.update({ data });

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

  async updatePackageTransaction(data: UpdatePackageTransactionOption) {
    const packageTransaction = (
      await this._packageRepository.findPackageTransaction({
        filters: { id: data.id },
        perPage: 1,
      })
    )?.[0];

    if (
      packageTransaction === undefined ||
      packageTransaction.deposit_account_id === null
    ) {
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

    const packageData = (
      await this._packageRepository.find({
        filters: { id: packageTransaction.package_id },
      })
    )?.[0];

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

    const classTypes = (
      await this._classTypeRepository.find({
        filters: { id: packageData.class_type_id },
      })
    )?.[0];

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

    if (dataWithDiscount.status !== 'completed') {
      const updatePackageTransaction =
        await this._packageRepository.updatePackageTransaction({
          data: {
            ...dataWithDiscount,
            deposit_account_id:
              dataWithDiscount.deposit_account_id ??
              packageTransaction.deposit_account_id,
            voucher_discount:
              dataWithDiscount.voucher_discount ??
              packageTransaction.voucher_discount,
            voucher_id:
              dataWithDiscount.voucher_id ?? packageTransaction.voucher_id,
            amount_paid: reducedPrice,
          },
        });

      if (updatePackageTransaction instanceof Error) {
        return {
          result: undefined,
          error: updatePackageTransaction,
        };
      }
    } else {
      const expiredAt = addDays(new Date(), packageData?.valid_for ?? 0);

      const userPackage = await this._packageRepository.createUserPackage({
        data: {
          user_id: packageTransaction.user_id,
          package_id: packageTransaction.package_id,
          expired_at: expiredAt,
          credit: packageTransaction.credit ?? 0,
          note: `You bought ${packageData.name}`,
        },
      });

      if (userPackage instanceof Error) {
        return {
          result: undefined,
          error: userPackage,
        };
      }

      const updatePackageTransaction =
        await this._packageRepository.updatePackageTransaction({
          data: {
            ...dataWithDiscount,
            deposit_account_id:
              dataWithDiscount.deposit_account_id ??
              packageTransaction.deposit_account_id,
            voucher_discount:
              dataWithDiscount.voucher_discount ??
              packageTransaction.voucher_discount,
            voucher_id:
              dataWithDiscount.voucher_id ?? packageTransaction.voucher_id,
            user_package_id: userPackage.id,
            amount_paid: reducedPrice,
          },
        });

      // loyalty
      const loyalty = await this._loyaltyRepository.createOnReward({
        reward_id: 5,
        user_id: user.id,
        note: `You bought ${packageData.name}`,
        reference_id: data.id,
      });

      if (loyalty) {
        return {
          result: undefined,
          error: loyalty,
        };
      }

      const notification = await this._notificationService.sendNotification({
        payload: {
          type: NotificationType.AdminConfirmedUserPackage,
          package: packageData.name,
          credit: packageTransaction.credit,
          status: 'completed',
          expired_at: expiredAt,
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

  async updatePackageTransactionImage(data: UpdatePackageTransactionImage) {
    if (!data.image_url) {
      return {
        result: undefined,
        error: new Error('Image url is required'),
      };
    }
    if (!data.id) {
      return {
        result: undefined,
        error: new Error('Package transaction id is required'),
      };
    }
    const result = await this._packageRepository.updatePackageTransaction({
      data: {
        id: data.id,
        image_url: data.image_url,
      },
      filters: {
        id: data.id,
      },
    });

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
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'package_transactions'>();
    customFilters.push(eb('created_at', '<', addDays(new Date(), -2)));

    const packageTransactions =
      await this._packageRepository.findPackageTransaction({
        filters: {
          status: 'pending',
        },
        customFilters: customFilters,
      });

    const result = await this._packageRepository.updatePackageTransaction({
      data: {
        status: 'failed',
      },
      filters: {
        status: 'pending',
      },
      customFilters: customFilters,
    });

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: packageTransactions,
    };
  }
}
