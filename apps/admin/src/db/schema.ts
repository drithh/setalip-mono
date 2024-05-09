import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  users: UserTable;
  auth_users: AuthUserTable;
  user_sessions: UserSessionTable;
}

export interface UserTable {
  id: Generated<number>;
  email: string;
  hashed_password: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface AuthUserTable {
  id: number;
}

export type AuthUser = Selectable<AuthUserTable>;
export type NewAuthUser = Insertable<AuthUserTable>;
export type AuthUserUpdate = Updateable<AuthUserTable>;

export interface UserSessionTable {
  id: string;
  expires_at: Date;
  user_id: number;
}

export type UserSession = Selectable<UserSessionTable>;
export type NewUserSession = Insertable<UserSessionTable>;
export type UserSessionUpdate = Updateable<UserSessionTable>;
