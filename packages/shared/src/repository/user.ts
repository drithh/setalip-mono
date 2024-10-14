import { CreditTransactions, Users } from '#dep/db/index';
import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import { DefaultPagination, OptionalToRequired, SelectCredit } from '.';

export type InsertUser = Insertable<Users>;
export type UpdateUser = OptionalToRequired<Updateable<Users>, 'id'>;
export type SelectUser = Selectable<Users>;

export interface SelectMember {
  id: SelectUser['id'];
  name: SelectUser['name'];
}

export interface SelectAmountCredit {
  class_type_name: string;
  class_type_id: number;
  remaining_amount: number;
}

export interface SelectUserWithCredits extends SelectUser {
  credits: SelectAmountCredit[];
}

export interface FindAllUserOptions extends DefaultPagination {
  name?: string;
  roles?: SelectUser['role'][];
}

export type SelectAllUserName = {
  name: SelectUser['name'];
  id: SelectUser['id'];
}[];

export interface SelectAllUser {
  data: SelectUserWithCredits[];
  pageCount: number;
}

export interface UserRepository {
  count(): Promise<number>;

  findAll(data: FindAllUserOptions): Promise<SelectAllUser>;
  findAllUserName(): Promise<SelectAllUserName>;
  findAllUserBirthday(): Promise<SelectUser[]>;

  findAllMember(): Promise<SelectMember[]>;
  findById(id: SelectUser['id']): Promise<SelectUser | undefined>;
  findByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined>;
  findByEmail(email: SelectUser['email']): Promise<SelectUser | undefined>;

  create(data: InsertUser): Promise<SelectUser | Error>;

  update(data: UpdateUser): Promise<undefined | Error>;
  delete(data: SelectUser['id']): Promise<undefined | Error>;
}
