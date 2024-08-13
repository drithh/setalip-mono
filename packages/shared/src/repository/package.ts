import { Insertable, Selectable, Updateable } from 'kysely';
import {
  ClassTypes,
  Classes,
  DepositAccounts,
  PackageTransactions,
  Packages,
  UserPackages,
  Users,
} from '../db';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectCredit,
  SelectDepositAccount,
  SelectVoucher,
} from '.';

export interface FindAllPackageOptions extends DefaultPagination {
  name?: string;
  types?: number[];
  is_active?: number;
}

export interface SelectPackages extends SelectPackage {
  class_type: ClassTypes['type'];
}

export interface SelectAllPackage {
  data: SelectPackages[];
  pageCount: number;
}

export type SelectPackage = Selectable<Packages>;
export type InsertPackage = Insertable<Packages>;
export type UpdatePackage = OptionalToRequired<Updateable<Packages>, 'id'>;

export type SelectPackageTransaction = Selectable<PackageTransactions>;

export interface InsertPackageTransaction {
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

export interface UpdatePackageTransaction {
  id: SelectPackageTransaction['id'];
  status: SelectPackageTransaction['status'];
  deposit_account_id?: SelectPackageTransaction['deposit_account_id'];
  amount_paid: SelectPackageTransaction['amount_paid'] | null;

  discount: SelectPackageTransaction['discount'];
  voucher_id: SelectVoucher['id'] | null;
  voucher_code: SelectVoucher['code'] | null;
  voucher_discount: SelectPackageTransaction['voucher_discount'];
}

export interface SelectPackageTransactionWithUser
  extends SelectPackageTransaction {
  package_name: Selectable<Packages>['name'];
  deposit_account_bank: Selectable<DepositAccounts>['bank_name'];
  user_id: Selectable<Users>['id'];
  user_name: Selectable<Users>['name'];
}

export interface SelectPackageTransactionWithPackage
  extends Omit<
    Selectable<PackageTransactions>,
    'created_at' | 'updated_at' | 'updated_by'
  > {
  package_expired_at: Selectable<UserPackages>['expired_at'] | null;
  package_name: Selectable<Packages>['name'] | null;
  credit: Selectable<UserPackages>['credit'] | null;
}

export interface FindAllUserPackageTransactionOption extends DefaultPagination {
  status?: SelectPackageTransaction['status'][];
  user_name?: Selectable<Users>['name'];
}

export interface FindAllUserPackageOption extends DefaultPagination {
  status?: SelectPackageTransaction['status'][];
  user_id: SelectPackageTransaction['user_id'];
}

export interface SelectPackageTransactionByUser {
  package_id: number;
  unique_code: number;
  user_id: number;
  is_new: boolean;

  id: number | null;
  deposit_account_id: number | null;
  discount: number | null;
  user_package_id: number | null;
  voucher_id: number | null;
  voucher_discount: number | null;
}

export interface SelectAllPackageTransactionWithUser {
  data: SelectPackageTransactionWithUser[];
  pageCount: number;
}
export interface SelectAllPackageTransaction {
  data: SelectPackageTransactionWithPackage[];
  pageCount: number;
}

export interface SelectAllActivePackage extends Selectable<UserPackages> {
  credit_used: Selectable<UserPackages>['credit'] | null;
  package_name: Selectable<Packages>['name'];
  class_type: ClassTypes['type'];
}

export interface UpdatePackageTransactionResult {
  status: SelectPackageTransaction['status'];
  credit: SelectCredit['amount'];
  expired_at: SelectCredit['expired_at'];
}

export interface PackageRepository {
  count(): Promise<number>;

  findAll(data: FindAllPackageOptions): Promise<SelectAllPackage>;
  findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;
  findAllPackageTransaction(
    data: FindAllUserPackageTransactionOption
  ): Promise<SelectAllPackageTransactionWithUser>;
  findPackageTransactionById(
    id: SelectPackageTransaction['id']
  ): Promise<SelectPackageTransactionWithPackage | undefined>;
  findAllPackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ): Promise<SelectAllActivePackage[]>;
  findAllPackageTransactionByUserId(
    data: FindAllUserPackageOption
  ): Promise<SelectAllPackageTransaction>;
  findPackageTransactionByVoucherIdAndUserId(
    voucher_id: SelectPackageTransaction['voucher_id'],
    user_id: SelectPackageTransaction['user_id']
  ): Promise<SelectPackageTransaction | undefined>;
  findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ): Promise<SelectAllActivePackage[]>;
  findAboutToExpiredPackage(
    user_id: SelectPackageTransaction['user_id'],
    class_type: SelectClassType['id']
  ): Promise<SelectAllActivePackage | undefined>;
  findPackageTransactionByUserIdAndPackageId(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ): Promise<SelectPackageTransactionByUser>;

  create(data: InsertPackage): Promise<SelectPackage | Error>;
  createPackageTransaction(
    data: InsertPackageTransaction
  ): Promise<SelectPackageTransaction | Error>;

  update(data: UpdatePackage): Promise<undefined | Error>;
  updatePackageTransaction(
    data: UpdatePackageTransaction
  ): Promise<UpdatePackageTransactionResult | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
  deleteExpiredPackageTransaction(): Promise<
    SelectPackageTransaction[] | Error
  >;
}
