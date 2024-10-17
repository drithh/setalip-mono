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
import {
  SelectUserPackage__Package__ClassType__PackageTransaction,
  PackageWithClassType,
  UserPackageWithClassType,
  UserPackageWithCreditTransaction,
  UserPackageWithPackage,
  PackageTransactionWithPackage,
  PackageTransactionWithUserPackage,
  PackageTransactionWithUser,
  PackageTransactionWithDepositAccount,
} from '#dep/service/package';

export type SelectPackage = Selectable<Packages>;
export type SelectUserPackage = Selectable<UserPackages>;
export type SelectPackageTransaction = Selectable<PackageTransactions>;

export type SelectPackageReturn<T extends SelectPackageQuery> = SelectPackage &
  (T['withClassType'] extends true ? PackageWithClassType : {});

export type SelectUserPackageReturn<T extends SelectUserPackageQuery> =
  SelectUserPackage &
    (T['withClassType'] extends true ? UserPackageWithClassType : {}) &
    (T['withCreditTransaction'] extends true
      ? UserPackageWithCreditTransaction
      : {}) &
    (T['withPackage'] extends true ? UserPackageWithPackage : {});

export type SelectPackageTransactionReturn<
  T extends SelectPackageTransactionQuery,
> = SelectPackageTransaction &
  (T['withPackage'] extends true ? PackageTransactionWithPackage : {}) &
  (T['withUserPackage'] extends true ? PackageTransactionWithUserPackage : {}) &
  (T['withUser'] extends true ? PackageTransactionWithUser : {}) &
  (T['withDepositAccount'] extends true
    ? PackageTransactionWithDepositAccount
    : {});

export interface SelectPackagePagination<T extends SelectPackageQuery> {
  data: SelectPackageReturn<T>[];
  pageCount: number;
}

export interface SelectPackageTransactionPagination<
  T extends SelectPackageTransactionQuery,
> {
  data: SelectPackageTransactionReturn<T>[];
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

  find<T extends SelectPackageQuery>(
    data?: T
  ): Promise<SelectPackageReturn<T>[]>;
  findWithPagination<T extends SelectPackageQuery>(
    data?: T
  ): Promise<SelectPackagePagination<T>>;

  findUserPackage<T extends SelectUserPackageQuery>(
    data?: T
  ): Promise<SelectUserPackageReturn<T>[]>;
  findAllUserPackageActiveByUserId(
    user_id: SelectUserPackage['user_id']
  ): Promise<SelectUserPackage__Package__ClassType__PackageTransaction[]>;

  findPackageTransaction<T extends SelectPackageTransactionQuery>(
    data?: T
  ): Promise<SelectPackageTransactionReturn<T>[]>;
  findPackageTransactionWithPagination<T extends SelectPackageTransactionQuery>(
    data?: T
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
