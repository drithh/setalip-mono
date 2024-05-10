import { Adapter, Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { env } from '#dep/env';
import { pool } from '#dep/db/index';
import { injectable } from 'inversify';

const adapter = new Mysql2Adapter(pool, {
  user: 'users',
  session: 'user_sessions',
});

@injectable()
export class Auth extends Lucia {
  constructor() {
    super(adapter, {
      sessionCookie: {
        expires: false,
        attributes: {
          secure: env.NODE_ENV === 'production',
        },
      },
      getSessionAttributes: (attributes) => {
        return {};
      },
      getUserAttributes: (attributes) => {
        return {
          email: attributes.email,
        };
      },
      sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
    });
  }
}

export const lucia = new Auth();

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
  export interface DatabaseSessionAttributes {}
  export interface DatabaseUserAttributes {
    email: string;
  }
}
