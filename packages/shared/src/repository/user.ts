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
  GetUsers(): Promise<User[]>;
  FindUserById(id: UserID): Promise<User>;
  FindUserByEmail(email: UserEmail): Promise<User>;
  CreateUser(data: CreateUser): Promise<InsertResult>;
  UpdateUser(data: UpdateUser): Promise<User>;
  DeleteUser(data: DeleteUser): Promise<DeleteResult>;
}
