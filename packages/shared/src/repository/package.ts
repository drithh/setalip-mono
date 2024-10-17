import {
  Expression,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import {
  ClassTypes,
  Classes,
  Command,
  CreditTransactions,
  DepositAccounts,
  PackageTransactions,
  Packages,
  Query,
  UserPackages,
  Users,
} from '../db';
import { FindAllUserPackageActiveByUserId } from '#dep/service/package';

export type SelectUserPackage = Selectable<UserPackages>;
export type SelectPackage = Selectable<Packages>;
export type SelectPackageTransaction = Selectable<PackageTransactions>;

export interface SelectPackagePagination<T extends SelectPackage> {
  data: T[];
  pageCount: number;
}

export interface SelectPackageTransactionPagination<
  T extends SelectPackageTransaction,
> {
  data: T[];
  pageCount: number;
}

export interface SelectPackageQuery extends Query<SelectPackage> {
  withClassType?: boolean;
}

export interface SelectUserPackageQuery extends Query<SelectUserPackage> {
  withPackage?: boolean;
  withClassType?: boolean;
  withCreditTransaction?: boolean;
}
export interface SelectPackageTransactionQuery
  extends Query<SelectPackageTransaction> {
  withPackage?: boolean;
  withUserPackage?: boolean;
  withUser?: boolean;
  withDepositAccount?: boolean;
}

export type InsertPackage = Insertable<Packages>;
export type InsertUserPackage = Insertable<UserPackages>;
export type InsertPackageTransaction = Insertable<PackageTransactions>;
export interface InsertPackageCommand extends Command<Packages> {
  data: InsertPackage;
}
export interface InsertUserPackageCommand extends Command<UserPackages> {
  data: InsertUserPackage;
}
export interface InsertPackageTransactionCommand
  extends Command<PackageTransactions> {
  data: InsertPackageTransaction;
}

export type UpdatePackage = Updateable<Packages>;
export type UpdateUserPackage = Updateable<UserPackages>;
export type UpdatePackageTransaction = Updateable<PackageTransactions>;

export interface UpdatePackageCommand extends Command<SelectPackage> {
  data: UpdatePackage;
}
export interface UpdateUserPackageCommand extends Command<SelectUserPackage> {
  data: UpdateUserPackage;
}
export interface UpdatePackageTransactionCommand
  extends Command<SelectPackageTransaction> {
  data: UpdatePackageTransaction;
}

export interface DeletePackageCommand extends Command<SelectPackage> {}

export interface PackageRepository {
  count(): Promise<number>;

  find(data?: SelectPackageQuery): Promise<SelectPackage[]>;
  findWithPagination<T extends SelectPackage>(
    data?: SelectPackageQuery
  ): Promise<SelectPackagePagination<T>>;

  findUserPackage<T extends SelectUserPackage>(
    data?: SelectUserPackageQuery
  ): Promise<T[]>;
  findAllUserPackageActiveByUserId(
    user_id: SelectUserPackage['user_id']
  ): Promise<FindAllUserPackageActiveByUserId[]>;

  findPackageTransaction<T extends SelectPackageTransaction>(
    data?: SelectPackageTransactionQuery
  ): Promise<T[]>;
  findPackageTransactionWithPagination<T extends SelectPackageTransaction>(
    data?: SelectPackageTransactionQuery
  ): Promise<SelectPackageTransactionPagination<T>>;

  create(data: InsertPackageCommand): Promise<SelectPackage | Error>;
  createUserPackage(
    data: InsertUserPackageCommand
  ): Promise<SelectUserPackage | Error>;
  createPackageTransaction(
    data: InsertPackageTransactionCommand
  ): Promise<SelectPackageTransaction | Error>;

  update(data: UpdatePackageCommand): Promise<undefined | Error>;
  updateUserPackage(data: UpdateUserPackageCommand): Promise<undefined | Error>;
  updatePackageTransaction(
    data: UpdatePackageTransactionCommand
  ): Promise<undefined | Error>;

  delete(data: DeletePackageCommand): Promise<undefined | Error>;
}
