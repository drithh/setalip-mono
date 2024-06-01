import { CreditTransactions, Users } from '#dep/db/index';
import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import { DefaultPagination, OptionalToRequired } from '.';

export type InsertUser = Insertable<Users>;
export type UpdateUser = OptionalToRequired<Updateable<Users>, 'id'>;
export type SelectUser = Selectable<Users>;

export type InsertCredit = Insertable<CreditTransactions>;
export type UpdateCredit = OptionalToRequired<
  Updateable<CreditTransactions>,
  'id'
>;

export interface SelectUserWithCredits extends SelectUser {
  credits: SelectAmountCredit[];
}

export type SelectCredit = Selectable<CreditTransactions>;
export interface SelectAmountCredit {
  class_type_id: SelectCredit['class_type_id'];
  remaining_amount: SelectCredit['amount'];
}
export interface DeleteCredit {
  user_id: SelectCredit['user_id'];
  class_type_id: SelectCredit['class_type_id'];
  amount: SelectCredit['amount'];
  note: SelectCredit['note'];
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
  findById(id: SelectUser['id']): Promise<SelectUser | undefined>;
  findByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined>;
  findByEmail(email: SelectUser['email']): Promise<SelectUser | undefined>;
  findCreditsByUserId(userId: SelectUser['id']): Promise<SelectAmountCredit[]>;

  create(data: InsertUser): Promise<SelectUser | Error>;
  createCredit(data: InsertCredit): Promise<SelectCredit | Error>;

  update(data: UpdateUser): Promise<undefined | Error>;
  delete(data: SelectUser['id']): Promise<undefined | Error>;
  deleteCredit(data: DeleteCredit): Promise<undefined | Error>;
}
