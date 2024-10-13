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

// export type SelectPackage = Selectable<Packages>;
// export type InsertPackage = Insertable<Packages>;
// export type UpdatePackage = OptionalToRequired<Updateable<Packages>, 'id'>;

// export type SelectPackageTransaction = Selectable<PackageTransactions>;

export interface InsertPackageTransactionWW {
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

export interface UpdatePackageTransactionWW {
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

export interface SelectAllActivePackage extends Selectable<SelectPackage> {
  credit_used: Selectable<UserPackages>['credit'];
  class_type: ClassTypes['type'];
}

export interface SelectAllUserPackage extends Selectable<UserPackages> {
  package_name: Selectable<Packages>['name'] | null;
  class_type: ClassTypes['type'];
}

export interface UpdatePackageTransactionResult {
  status: SelectPackageTransaction['status'];
  credit: SelectPackageTransaction['credit'];
  expired_at: Selectable<UserPackages>['expired_at'];
}

export interface UpdatePackageTransactionImage {
  id: SelectPackageTransaction['id'];
  image_url: SelectPackageTransaction['image_url'];
}

// dasdasdas

export type SelectPackage = Selectable<Packages>;
export type SelectPackageTransaction = Selectable<PackageTransactions>;

export interface SelectPackagePagination<T extends SelectPackage> {
  data: T[];
  pageCount: number;
}

export interface SelectPackageTransactionPagination {
  data: SelectPackageTransaction[];
  pageCount: number;
}

export interface SelectPackageQuery extends Query<SelectPackage> {
  withClassType?: boolean;
}
export interface SelectPackageTransactionQuery
  extends Query<SelectPackageTransaction> {}

export type InsertPackage = Insertable<PackageTransactions>;
export type InsertPackageTransaction = Insertable<PackageTransactions>;
export interface InsertPackageCommand extends Command {
  data: InsertPackage;
}
export interface InsertPackageTransactionCommand extends Command {
  data: InsertPackageTransaction;
}

export type UpdatePackage = OptionalToRequired<
  Updateable<PackageTransactions>,
  'id'
>;
export type UpdatePackageTransaction = OptionalToRequired<
  Updateable<PackageTransactions>,
  'id'
>;

export interface UpdatePackageCommand extends Command {
  data: UpdatePackage;
}
export interface UpdatePackageTransactionCommand extends Command {
  data: UpdatePackageTransaction;
}

export interface DeletePackageCommand extends Command {
  filters: Partial<SelectPackage>;
}

export interface DeletePackageTranscationCommand extends Command {
  filters: Partial<SelectPackageTransaction>;
}
export interface PackageRepository {
  count(): Promise<number>;

  find(data?: SelectPackageQuery): Promise<SelectPackage[]>;
  findWithPagination<T extends SelectPackage>(
    data?: SelectPackageQuery
  ): Promise<SelectPackagePagination<T>>;

  findPackageTransaction(
    data?: SelectPackageTransactionQuery
  ): Promise<SelectPackageTransaction[]>;
  findPackageTransactionWithPagination(
    data?: SelectPackageTransactionQuery
  ): Promise<SelectPackageTransactionPagination>;

  // findAll(data: FindAllPackageOptions): Promise<SelectAllPackage>;
  // findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;
  // findAllPackageTransaction(
  //   data: FindAllUserPackageTransactionOption
  // ): Promise<SelectAllPackageTransactionWithUser>;
  // findPackageTransactionById(
  //   id: SelectPackageTransaction['id']
  // ): Promise<SelectPackageTransactionWithPackage | undefined>;
  // findAllPackageByUserId(
  //   user_id: SelectPackageTransaction['user_id']
  // ): Promise<SelectAllUserPackage[]>;
  // findAllPackageTransactionByUserId(
  //   data: FindAllUserPackageOption
  // ): Promise<SelectAllPackageTransaction>;
  // findPackageTransactionByVoucherIdAndUserId(
  //   voucher_id: SelectPackageTransaction['voucher_id'],
  //   user_id: SelectPackageTransaction['user_id']
  // ): Promise<SelectPackageTransaction | undefined>;
  // findAllActivePackageByUserId(
  //   user_id: SelectPackageTransaction['user_id']
  // ): Promise<SelectAllActivePackage[]>;
  // findAboutToExpired(
  //   user_id: SelectPackageTransaction['user_id'],
  //   class_type: SelectClassType['id']
  // ): Promise<SelectAllActivePackage | undefined>;
  // findPackageTransactionByUserIdAndPackageId(
  //   user_id: SelectPackageTransaction['user_id'],
  //   package_id: SelectPackage['id']
  // ): Promise<SelectPackageTransactionByUser>;

  create(data: InsertPackageCommand): Promise<SelectPackage | Error>;
  createPackageTransaction(
    data: InsertPackageTransactionCommand
  ): Promise<SelectPackageTransaction | Error>;

  update(data: UpdatePackageCommand): Promise<undefined | Error>;
  // updatePackageTransactionImage(
  //   data: UpdatePackageTransactionImage
  // ): Promise<undefined | Error>;
  updatePackageTransaction(
    data: UpdatePackageTransactionCommand
  ): Promise<UpdatePackageTransactionResult | Error>;

  delete(data: DeletePackageCommand): Promise<undefined | Error>;
  // deletePackageTransaction(
  //   data: DeletePackageTranscationCommand
  // ): Promise<undefined | Error>;
  // deleteExpiredPackageTransaction(): Promise<
  // SelectPackageTransaction[] | Error
  // >;
}
