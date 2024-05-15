import { Adapter, Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { env } from '#dep/env';
import { pool } from '#dep/db/index';
import { injectable } from 'inversify';
import { SelectUser } from '../repository';

const adapter = new Mysql2Adapter(pool, {
  user: 'users',
  session: 'user_sessions',
});

export const lucia = new Lucia(adapter, {
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
      verified_at: attributes.verified_at,
      role: attributes.role,
    };
  },
  sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
});

// IMPORTANT!
declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
  export interface DatabaseSessionAttributes {
    userId: number;
  }
  export interface DatabaseUserAttributes {
    email: SelectUser['email'];
    verified_at: SelectUser['verified_at'];
    role: SelectUser['role'];
  }
}
