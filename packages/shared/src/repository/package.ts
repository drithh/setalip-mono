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
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectCredit,
  SelectDepositAccount,
  SelectVoucher,
} from '.';

// export interface SelectPackages extends SelectPackage {
//   class_type: ClassTypes['type'];
// }

// export interface SelectAllPackage {
//   data: SelectPackages[];
//   pageCount: number;
// }

// export type SelectPackage = Selectable<Packages>;
// export type InsertPackage = Insertable<Packages>;
// export type UpdatePackage = OptionalToRequired<Updateable<Packages>, 'id'>;

// export type SelectPackageTransaction = Selectable<PackageTransactions>;

// export interface InsertPackageTransactionWW {
//   user_id: SelectPackageTransaction['user_id'];
//   package_id: SelectPackage['id'];
//   deposit_account_id: SelectDepositAccount['id'];
//   unique_code: SelectPackageTransaction['unique_code'];
//   amount_paid: SelectPackageTransaction['amount_paid'];

//   discount: SelectPackageTransaction['discount'];
//   voucher_id: SelectVoucher['id'] | null;
//   voucher_code: SelectVoucher['code'] | null;
//   voucher_discount: SelectPackageTransaction['voucher_discount'];
// }

// export interface UpdatePackageTransactionWW {
//   id: SelectPackageTransaction['id'];
//   status: SelectPackageTransaction['status'];
//   deposit_account_id?: SelectPackageTransaction['deposit_account_id'];
//   amount_paid: SelectPackageTransaction['amount_paid'] | null;

//   discount: SelectPackageTransaction['discount'];
//   voucher_id: SelectVoucher['id'] | null;
//   voucher_code: SelectVoucher['code'] | null;
//   voucher_discount: SelectPackageTransaction['voucher_discount'];
// }

// export interface SelectPackageTransactionWithUser
//   extends SelectPackageTransaction {
//   package_name: Selectable<Packages>['name'];
//   deposit_account_bank: Selectable<DepositAccounts>['bank_name'];
//   user_id: Selectable<Users>['id'];
//   user_name: Selectable<Users>['name'];
// }

// export interface SelectPackageTransactionWithPackage
//   extends Omit<
//     Selectable<PackageTransactions>,
//     'created_at' | 'updated_at' | 'updated_by'
//   > {
//   package_expired_at: SelectUserPackage['expired_at'] | null;
//   package_name: Selectable<Packages>['name'] | null;
//   credit: SelectUserPackage['credit'] | null;
// }

// export interface FindAllUserPackageTransactionOption extends DefaultPagination {
//   status?: SelectPackageTransaction['status'][];
//   user_name?: Selectable<Users>['name'];
// }

// export interface FindAllUserPackageOption extends DefaultPagination {
//   status?: SelectPackageTransaction['status'][];
//   user_id: SelectPackageTransaction['user_id'];
// }

// export interface SelectPackageTransactionByUser {
//   package_id: number;
//   unique_code: number;
//   user_id: number;
//   is_new: boolean;

//   id: number | null;
//   deposit_account_id: number | null;
//   discount: number | null;
//   user_package_id: number | null;
//   voucher_id: number | null;
//   voucher_discount: number | null;
// }

// export interface SelectAllPackageTransactionWithUser {
//   data: SelectPackageTransactionWithUser[];
//   pageCount: number;
// }
// export interface SelectAllPackageTransaction {
//   data: SelectPackageTransactionWithPackage[];
//   pageCount: number;
// }

// export interface SelectAllActivePackage extends Selectable<SelectPackage> {
//   credit_used: Selectable<UserPackages>['credit'];
//   class_type: ClassTypes['type'];
// }

// export interface SelectAllUserPackage extends Selectable<UserPackages> {
//   package_name: Selectable<Packages>['name'] | null;
//   class_type: ClassTypes['type'];
// }

// export interface UpdatePackageTransactionImage {
//   id: SelectPackageTransaction['id'];
//   image_url: SelectPackageTransaction['image_url'];
// }

// dasdasdas
export type SelectUserPackage = Selectable<UserPackages>;

// export interface SelectUserPackage<T extends Selectable<UserPackages>> {}

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
