import { Selectable, Insertable, Updateable } from 'kysely';

export interface UserSessionTable {
  id: string;
  expires_at: Date;
  user_id: number;
}

export type UserSession = Selectable<UserSessionTable>;
export type CreateUserSession = Insertable<UserSessionTable>;
export type UpdateUserSession = Updateable<UserSessionTable>;
export type DeleteUserSession = Selectable<UserSessionTable>['id'];
