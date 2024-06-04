import {
  SelectClass,
  InsertClass,
  UpdateClass,
  FindAllClassOptions,
  SelectAllClass,
} from '../repository';
import { PromiseResult } from '../types';

export interface ClassService {
  findAll(data: FindAllClassOptions): PromiseResult<SelectAllClass, Error>;
  findById(
    id: SelectClass['id']
  ): PromiseResult<SelectClass | undefined, Error>;

  create(data: InsertClass): PromiseResult<SelectClass, Error>;

  update(data: UpdateClass): PromiseResult<undefined, Error>;

  delete(id: SelectClass['id']): PromiseResult<undefined, Error>;
}
