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
  getUsers(): Promise<SelectUser[]>;
  findUserById(id: SelectUser['id']): Promise<SelectUser | undefined>;
  findUserByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined>;
  findUserByEmail(email: SelectUser['email']): Promise<SelectUser | undefined>;
  createUser(data: InsertUser): Promise<InsertResult>;
  updateUser(data: UpdateUser): Promise<UpdateResult>;
  deleteUser(data: SelectUser['id']): Promise<DeleteResult>;
}
