import { Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { env } from '#dep/env';
import { pool } from '#dep/db/index';
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
    return {
      userId: attributes.userId,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      verifiedAt: attributes.verified_at,
      phoneNumber: attributes.phone_number,
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
    UserId: SelectUser['id'];
  }
  export interface DatabaseSessionAttributes {
    userId: SelectUser['id'];
  }
  export interface DatabaseUserAttributes {
    email: SelectUser['email'];
    phone_number: SelectUser['phone_number'];
    verified_at: SelectUser['verified_at'];
    role: SelectUser['role'];
  }
}
