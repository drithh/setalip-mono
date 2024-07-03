import {
  SelectUser,
  InsertUser,
  UpdateUser,
  SelectAllUser,
  FindAllUserOptions,
  InsertCredit,
  SelectCredit,
  SelectAmountCredit,
  DeleteCredit,
  SelectAllUserName,
} from '../repository';
import { PromiseResult } from '../types';

export interface UserService {
  findAll(data: FindAllUserOptions): PromiseResult<SelectAllUser, Error>;
  findAllUserName(): PromiseResult<SelectAllUserName, Error>;
  findAllMember(): PromiseResult<SelectUser[], Error>;
  findById(id: SelectUser['id']): PromiseResult<SelectUser, Error>;

  update(data: UpdateUser): PromiseResult<undefined, Error>;
}
