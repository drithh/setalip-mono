import {
  SelectPackage,
  InsertPackage,
  UpdatePackage,
  FindAllPackageOptions,
  SelectAllPackage,
  FindAllUserPackageOption,
  SelectAllActivePackage,
  SelectAllPackageTransaction,
  SelectPackageTransaction,
  SelectClassType,
  SelectUniqueCode,
  InsertPackageTransaction,
  UpdatePackageTransaction,
} from '../repository';
import { PromiseResult } from '../types';

export interface PackageService {
  findAll(data: FindAllPackageOptions): PromiseResult<SelectAllPackage, Error>;
  findById(
    id: SelectPackage['id']
  ): PromiseResult<SelectPackage | undefined, Error>;
  findAllPackageTransactionByUserId(
    data: FindAllUserPackageOption
  ): PromiseResult<SelectAllPackageTransaction, Error>;
  findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ): PromiseResult<SelectAllActivePackage[], Error>;
  findAboutToExpiredPackage(
    user_id: SelectPackageTransaction['user_id'],
    class_type: SelectClassType['id']
  ): PromiseResult<SelectAllActivePackage | undefined, Error>;
  findPackageTransactionUniqueCode(
    user_id: SelectPackageTransaction['user_id'],
    package_id: SelectPackage['id']
  ): PromiseResult<SelectUniqueCode, Error>;

  create(data: InsertPackage): PromiseResult<SelectPackage, Error>;
  createPackageTransaction(
    data: InsertPackageTransaction
  ): PromiseResult<SelectPackageTransaction, Error>;

  update(data: UpdatePackage): PromiseResult<undefined, Error>;
  updatePackageTransaction(
    data: UpdatePackageTransaction
  ): PromiseResult<undefined, Error>;

  delete(id: SelectPackage['id']): PromiseResult<undefined, Error>;
}
