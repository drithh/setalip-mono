import { Users } from '#dep/db/index';
import { DeleteResult, InsertResult, Insertable, Selectable } from 'kysely';
import { MakeKeyRequired } from '.';

export type InsertUser = Insertable<Users>;
export type UpdateUser = MakeKeyRequired<Selectable<Users>, 'id'>;
export type SelectUser = Selectable<Users>;

export interface UserRepository {
  getUsers(): Promise<SelectUser[]>;
  findUserById(id: SelectUser['id']): Promise<SelectUser>;
  findUserByEmail(email: SelectUser['email']): Promise<SelectUser>;
  createUser(data: InsertUser): Promise<InsertResult>;
  updateUser(data: UpdateUser): Promise<SelectUser>;
  deleteUser(data: SelectUser['id']): Promise<DeleteResult>;
}
