import { SelectPackage, InsertPackage, UpdatePackage } from '../repository';
import { PromiseResult } from '../types';

export interface PackageService {
  findAll(): PromiseResult<SelectPackage[], Error>;
  findById(
    id: SelectPackage['id']
  ): PromiseResult<SelectPackage | undefined, Error>;

  create(data: InsertPackage): PromiseResult<SelectPackage, Error>;

  update(data: UpdatePackage): PromiseResult<undefined, Error>;

  delete(id: SelectPackage['id']): PromiseResult<undefined, Error>;
}
