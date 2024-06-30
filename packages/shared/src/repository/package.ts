import { Insertable, Selectable, Updateable } from 'kysely';
import {
  ClassTypes,
  Classes,
  PackageTransactions,
  Packages,
  UserPackages,
} from '../db';
import { DefaultPagination, OptionalToRequired } from '.';

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

export interface SelectPackageTransaction
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
  findAll(data: FindAllPackageOptions): Promise<SelectAllPackage>;
  findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;
  findAllPackageTransactionByUserId(
    data: FindAllUserPackageOption
  ): Promise<SelectAllPackageTransaction>;
  findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ): Promise<SelectAllActivePackage[]>;
  create(data: InsertPackage): Promise<SelectPackage | Error>;

  update(data: UpdatePackage): Promise<undefined | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
}
