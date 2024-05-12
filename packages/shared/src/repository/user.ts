import {
  User,
  CreateUser,
  UpdateUser,
  DeleteUser,
  UserID,
  UserEmail,
} from '#dep/schema/index';
import { DeleteResult, InsertResult } from 'kysely';

export interface UserRepository {
  getUsers(): Promise<User[]>;
  findUserById(id: UserID): Promise<User>;
  findUserByEmail(email: UserEmail): Promise<User>;
  createUser(data: CreateUser): Promise<InsertResult>;
  updateUser(data: UpdateUser): Promise<User>;
  deleteUser(data: DeleteUser): Promise<DeleteResult>;
}
