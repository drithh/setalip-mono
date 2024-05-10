import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface UserTable {
  id: Generated<number>;
  email: string;
  hashed_password: string;
}

export type User = Selectable<UserTable>;
export type CreateUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable> & { id: number };
export type DeleteUser = Selectable<UserTable>['id'];
export type UserID = Selectable<UserTable>['id'];
export type UserEmail = Selectable<UserTable>['email'];
