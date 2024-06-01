import {
  SelectUser,
  InsertUser,
  UpdateUser,
  SelectAllUser,
  FindAllUserOptions,
  InsertCredit,
  SelectCredit,
} from '../repository';
import { PromiseResult } from '../types';

export interface UserService {
  findAll(data: FindAllUserOptions): PromiseResult<SelectAllUser, Error>;
  findById(id: SelectUser['id']): PromiseResult<SelectUser | undefined, Error>;

  createCredit(data: InsertCredit): PromiseResult<SelectCredit, Error>;

  update(data: UpdateUser): PromiseResult<undefined, Error>;
}
