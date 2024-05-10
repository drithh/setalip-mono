import { UserSessionTable } from '#deps/schema/user-session';
import { UserTable } from '#deps/schema/user';

export * from '#deps/schema/user';
export * from '#deps/schema/user-session';

export interface Database {
  users: UserTable;
  user_sessions: UserSessionTable;
}
