import {
  SelectClass,
  InsertClass,
  UpdateClass,
  FindAllClassOptions,
  SelectAllClass,
  SelectAllClassWithAsset,
  SelectDetailClassAssetAndLocation,
} from '../repository';
import { PromiseResult } from '../types';

export interface ClassService {
  findAll(data: FindAllClassOptions): PromiseResult<SelectAllClass, Error>;
  findAllClassWithAsset(
    data: FindAllClassOptions
  ): PromiseResult<SelectAllClassWithAsset, Error>;
  findById(
    id: SelectClass['id']
  ): PromiseResult<SelectClass | undefined, Error>;
  findDetailClassAssetAndLocation(
    id: SelectClass['id']
  ): PromiseResult<SelectDetailClassAssetAndLocation | undefined, Error>;

  create(data: InsertClass): PromiseResult<SelectClass, Error>;

  update(data: UpdateClass): PromiseResult<undefined, Error>;

  delete(id: SelectClass['id']): PromiseResult<undefined, Error>;
}
