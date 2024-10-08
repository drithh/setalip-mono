import { Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { env } from '#dep/env';
import { SelectUser } from '../repository';
import { pool } from '@repo/shared/db';

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
      name: attributes.name,
      email: attributes.email,
      verifiedAt: attributes.verified_at,
      phoneNumber: attributes.phone_number,
      createdAt: attributes.created_at,
      locationId: attributes.location_id,
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
  export interface DatabaseSessionAttributes {}
  export interface DatabaseUserAttributes {
    name: SelectUser['name'];
    email: SelectUser['email'];
    phone_number: SelectUser['phone_number'];
    verified_at: SelectUser['verified_at'];
    created_at: SelectUser['created_at'];
    location_id: SelectUser['location_id'];
    role: SelectUser['role'];
  }
}
