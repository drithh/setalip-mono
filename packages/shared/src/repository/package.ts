import { Insertable, Selectable, Updateable } from 'kysely';
import {
  ClassTypes,
  Classes,
  PackageTransactions,
  Packages,
  UserPackages,
} from '../db';
import { DefaultPagination, OptionalToRequired, SelectClassType } from '.';

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
  deposit_account_id: SelectPackageTransaction['deposit_account_id'];
  unique_code: SelectPackageTransaction['unique_code'];
}

export interface UpdatePackageTransaction {
  id: SelectPackageTransaction['id'];
  status: SelectPackageTransaction['status'];
  deposit_account_id: SelectPackageTransaction['deposit_account_id'];
}

export interface SelectPackageTransactionWithPackage
  extends Omit<
    Selectable<PackageTransactions>,
    'created_at' | 'updated_at' | 'updated_by'
  > {
  package_expired_at: Selectable<UserPackages>['expired_at'];
  package_name: Selectable<Packages>['name'];
  credit: Selectable<UserPackages>['credit'];
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

export interface SelectAllPackageTransaction {
  data: SelectPackageTransaction[];
  pageCount: number;
}

export interface SelectAllActivePackage extends Selectable<UserPackages> {
  credit_used: Selectable<UserPackages>['credit'] | null;
  package_name: Selectable<Packages>['name'];
  class_type: ClassTypes['type'];
}

export interface PackageRepository {
  count(): Promise<number>;

  findAll(data: FindAllPackageOptions): Promise<SelectAllPackage>;
  findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;
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
  ): Promise<undefined | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
}
