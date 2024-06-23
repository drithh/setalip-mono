import { CreditTransactions, Users } from '#dep/db/index';
import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectAmountCredit,
  SelectCredit,
} from '.';

export type InsertUser = Insertable<Users>;
export type UpdateUser = OptionalToRequired<Updateable<Users>, 'id'>;
export type SelectUser = Selectable<Users>;

export interface SelectUserWithCredits extends SelectUser {
  credits: SelectAmountCredit[];
}

export interface FindAllUserOptions extends DefaultPagination {
  name?: string;
  roles?: SelectUser['role'][];
}

export interface SelectAllUser {
  data: SelectUserWithCredits[];
  pageCount: number;
}

export interface UserRepository {
  findAll(data: FindAllUserOptions): Promise<SelectAllUser>;
  findAllMember(): Promise<SelectUser[]>;
  findById(id: SelectUser['id']): Promise<SelectUser | undefined>;
  findByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined>;
  findByEmail(email: SelectUser['email']): Promise<SelectUser | undefined>;

  create(data: InsertUser): Promise<SelectUser | Error>;

  update(data: UpdateUser): Promise<undefined | Error>;
  delete(data: SelectUser['id']): Promise<undefined | Error>;
}
