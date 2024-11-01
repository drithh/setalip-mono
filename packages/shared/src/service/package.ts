import { Selectable } from 'kysely';
import { Users } from '../db';
import {
  SelectPackage,
  SelectClassType,
  DefaultPagination,
  SelectUserPackage,
  SelectPackagePagination,
  SelectPackageTransaction,
  InsertPackage,
  InsertPackageTransaction,
  UpdatePackage,
  UpdatePackageTransaction,
  SelectUser,
  SelectDepositAccount,
  SelectPackageTransactionPagination,
  SelectVoucher,
  InsertPackageCommand,
  SelectAgenda,
} from '../repository';
import { PromiseResult } from '../types';
import { DefaultReturn } from './agenda';

export interface PackageWithClassType {
  class_type: SelectClassType['type'];
}
export interface SelectPackage__ClassType
  extends SelectPackage,
    PackageWithClassType {}

export interface FindAllPackageOptions extends DefaultPagination {
  name?: string;
  types?: number[];
  is_active?: number;
}

export interface UserPackageWithPackage {
  package_name: SelectPackage['name'];
  package_credit: SelectPackage['credit'];
}

export interface UserPackageWithClassType {
  class_type_id: SelectClassType['id'];
  class_type: SelectClassType['type'];
}

export interface UserPackageWithCreditTransaction {
  credit_used: number;
}

export interface SelectUserPackage__Package__ClassType__PackageTransaction
  extends SelectUserPackage,
    UserPackageWithPackage,
    UserPackageWithClassType,
    UserPackageWithCreditTransaction {}

export interface FindAllUserPackageTransactionOption extends DefaultPagination {
  status?: SelectPackageTransaction['status'][];
  user_name?: SelectUser['name'];
}

export interface FindAllUserPackageTransactionByUserIdOption
  extends DefaultPagination {
  status?: SelectPackageTransaction['status'] | 'expired';
  user_id: SelectPackageTransaction['user_id'];
}

export interface UpdateUserPackageOption {
  id: SelectUserPackage['id'];
  credit: SelectUserPackage['credit'];
  expired_at: SelectUserPackage['expired_at'];
  credit_used: SelectUserPackage['credit'];
}

export interface PackageTransactionWithPackage {
  package_name: SelectPackage['name'];
}

export interface PackageTransactionWithUser {
  user_id: SelectUser['id'];
  user_name: SelectUser['name'];
}

export interface PackageTransactionWithDepositAccount {
  deposit_account_bank: SelectDepositAccount['bank_name'];
}

export interface PackageTransactionWithUserPackage {
  user_package_expired_at: SelectUserPackage['expired_at'];
  user_package_credit: SelectUserPackage['credit'];
  user_package_credit_used: SelectUserPackage['credit'];
}
// export interface SelectPackageTransactionByUser extends SelectPackageTransaction {
export interface SelectPackageTransaction__Package__UserPackage
  extends SelectPackageTransaction,
    PackageTransactionWithPackage,
    PackageTransactionWithUserPackage {}

export interface SelectPackageTransaction__Package__User__DepositAccount
  extends SelectPackageTransaction,
    PackageTransactionWithPackage,
    PackageTransactionWithUser,
    PackageTransactionWithDepositAccount {}

export interface InsertPackageTransactionOption {
  user_id: SelectPackageTransaction['user_id'];
  package_id: SelectPackage['id'];
  deposit_account_id: SelectDepositAccount['id'];
  unique_code: SelectPackageTransaction['unique_code'];
  amount_paid: SelectPackageTransaction['amount_paid'];

  discount: SelectPackageTransaction['discount'];
  voucher_id: SelectVoucher['id'] | null;
  voucher_code: SelectVoucher['code'] | null;
  voucher_discount: SelectPackageTransaction['voucher_discount'];
}

export interface UpdatePackageTransactionOption {
  id: SelectPackageTransaction['id'];
  status: SelectPackageTransaction['status'];
  deposit_account_id?: SelectPackageTransaction['deposit_account_id'];
  amount_paid: SelectPackageTransaction['amount_paid'] | null;

  discount: SelectPackageTransaction['discount'];
  voucher_id: SelectVoucher['id'] | null;
  voucher_code: SelectVoucher['code'] | null;
  voucher_discount: SelectPackageTransaction['voucher_discount'];
}

export interface UpdatePackageTransactionImage {
  id: SelectPackageTransaction['id'];
  image_url: SelectPackageTransaction['image_url'];
}

export interface PackageService {
  findAll(
    data: FindAllPackageOptions
  ): PromiseResult<DefaultReturn<SelectPackage__ClassType>, Error>;
  findById(
    id: SelectPackage['id']
  ): PromiseResult<SelectPackage | undefined, Error>;

  findAllUserPackageActiveByUserId(
    user_id: SelectUserPackage['user_id']
  ): PromiseResult<
    SelectUserPackage__Package__ClassType__PackageTransaction[],
    Error
  >;
  findUserPackageExpiringByUserId(
    user_id: SelectUserPackage['user_id'],
    class_type: SelectClassType['id'],
    minimalEXpired: SelectUserPackage['expired_at']
  ): PromiseResult<
    SelectUserPackage__Package__ClassType__PackageTransaction | undefined,
    Error
  >;

  findAllPackageTransaction(
    data: FindAllUserPackageTransactionOption
  ): PromiseResult<
    DefaultReturn<SelectPackageTransaction__Package__User__DepositAccount>,
    Error
  >;
  findAllPackageTransactionByUserId(
    data: FindAllUserPackageTransactionByUserIdOption
  ): PromiseResult<
    DefaultReturn<SelectPackageTransaction__Package__UserPackage>,
    Error
  >;
  findPackageTransactionById(
    id: SelectPackageTransaction['id']
  ): PromiseResult<
    SelectPackageTransaction__Package__UserPackage | undefined,
    Error
  >;
  findPackageTransactionByUserIdAndPackageId(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ): PromiseResult<SelectPackageTransaction, Error>;

  create(data: InsertPackageCommand): PromiseResult<SelectPackage, Error>;
  createPackageTransaction(
    data: InsertPackageTransactionOption
  ): PromiseResult<SelectPackageTransaction, Error>;

  update(data: UpdatePackage): PromiseResult<undefined, Error>;
  updateUserPackage(
    data: UpdateUserPackageOption
  ): PromiseResult<undefined, Error>;
  updatePackageTransaction(
    data: UpdatePackageTransactionOption
  ): PromiseResult<undefined, Error>;
  updatePackageTransactionImage(
    data: UpdatePackageTransactionImage
  ): PromiseResult<undefined, Error>;

  delete(id: SelectPackage['id']): PromiseResult<undefined, Error>;
  deleteUserPackage(
    id: SelectUserPackage['id']
  ): PromiseResult<undefined, Error>;
  deleteExpiredPackageTransaction(): PromiseResult<
    SelectPackageTransaction[],
    Error
  >;
}
