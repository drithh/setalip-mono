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
} from '.';

export interface FindAllPackageOptions extends DefaultPagination {
  name?: string;
  types?: number[];
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
  discount: SelectPackageTransaction['discount'];
  deposit_account_id: SelectDepositAccount['id'];
  unique_code: SelectPackageTransaction['unique_code'];
}

export interface UpdatePackageTransaction {
  id: SelectPackageTransaction['id'];
  status: SelectPackageTransaction['status'];
  deposit_account_id?: SelectPackageTransaction['deposit_account_id'];
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

export interface SelectUniqueCode {
  unique_code: SelectPackageTransaction['unique_code'];
  deposit_account_id: SelectPackageTransaction['deposit_account_id'];
  id: SelectPackageTransaction['id'];
  is_new: boolean;
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
  findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ): Promise<SelectAllActivePackage[]>;
  findAboutToExpiredPackage(
    user_id: SelectPackageTransaction['user_id'],
    class_type: SelectClassType['id']
  ): Promise<SelectAllActivePackage | undefined>;
  findPackageTransactionUniqueCode(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ): Promise<SelectUniqueCode>;

  create(data: InsertPackage): Promise<SelectPackage | Error>;
  createPackageTransaction(
    data: InsertPackageTransaction
  ): Promise<SelectPackageTransaction | Error>;

  update(data: UpdatePackage): Promise<undefined | Error>;
  updatePackageTransaction(
    data: UpdatePackageTransaction
  ): Promise<UpdatePackageTransactionResult | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
}
