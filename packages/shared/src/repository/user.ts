import { Users } from '#dep/db/index';
import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import { OptionalToRequired } from '.';

export type InsertUser = Insertable<Users>;
export type UpdateUser = OptionalToRequired<Updateable<Users>, 'id'>;
export type SelectUser = Selectable<Users>;

export interface UserRepository {
  findAll(): Promise<SelectUser[]>;
  findById(id: SelectUser['id']): Promise<SelectUser | undefined>;
  findByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined>;
  findByEmail(email: SelectUser['email']): Promise<SelectUser | undefined>;
  create(data: InsertUser): Promise<SelectUser | Error>;
  update(data: UpdateUser): Promise<undefined | Error>;
  delete(data: SelectUser['id']): Promise<undefined | Error>;
}
