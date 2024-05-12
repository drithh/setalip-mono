import { Users } from '#dep/db/index';
import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface UserRepository {
  getUsers(): Promise<Selectable<Users>[]>;
  findUserById(id: Users['id']): Promise<Selectable<Users>>;
  findUserByEmail(email: Users['email']): Promise<Selectable<Users>>;
  createUser(data: Insertable<Users>): Promise<InsertResult>;
  updateUser(data: Updateable<Users>): Promise<Selectable<Users>>;
  deleteUser(data: Users['id']): Promise<DeleteResult>;
}
