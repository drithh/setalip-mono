import { User, CreateUser, UpdateUser, DeleteUser } from '#deps/schema/index';
import { DeleteResult, InsertResult } from 'kysely';

export interface UserRepository {
  GetUsers(): Promise<User[]>;
  CreateUser(data: CreateUser): Promise<InsertResult>;
  UpdateUser(data: UpdateUser): Promise<User>;
  DeleteUser(data: DeleteUser): Promise<DeleteResult>;
}
