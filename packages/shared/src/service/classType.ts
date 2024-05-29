import {
  SelectClassType,
  InsertClassType,
  UpdateClassType,
} from '../repository';
import { PromiseResult } from '../types';

export interface ClassTypeService {
  findAll(): PromiseResult<SelectClassType[], Error>;
  findById(
    id: SelectClassType['id']
  ): PromiseResult<SelectClassType | undefined, Error>;

  create(data: InsertClassType): PromiseResult<SelectClassType, Error>;

  update(data: UpdateClassType): PromiseResult<undefined, Error>;

  delete(id: SelectClassType['id']): PromiseResult<undefined, Error>;
}
