import { UserSessionTable } from '#dep/schema/user-session';
import { UserTable } from '#dep/schema/user';

export * from '#dep/schema/user';
export * from '#dep/schema/user-session';

export interface DatabaseSchema {
  users: UserTable;
  user_sessions: UserSessionTable;
}
