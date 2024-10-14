import {
  SelectUser,
  InsertUser,
  UpdateUser,
  SelectAllUser,
  FindAllUserOptions,
  InsertCredit,
  SelectCredit,
  SelectAllUserName,
  SelectMember,
} from '../repository';
import { PromiseResult } from '../types';

export interface UserService {
  findAll(data: FindAllUserOptions): PromiseResult<SelectAllUser, Error>;
  findAllUserName(): PromiseResult<SelectAllUserName, Error>;
  findAllMember(): PromiseResult<SelectMember[], Error>;
  findById(id: SelectUser['id']): PromiseResult<SelectUser, Error>;

  update(data: UpdateUser): PromiseResult<undefined, Error>;
}
