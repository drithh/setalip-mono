import { UserId } from './../../node_modules/lucia/dist/index.d';
import { Lucia, TimeSpan } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';

import { Kysely, PostgresDialect } from 'kysely';
import { env } from '@/env';
import { Database } from '@/db/schema';
import { Pool } from 'pg';

const pool = new Pool();

const adapter = new NodePostgresAdapter(pool, {
  user: 'auth_users',
  session: 'user_sessions',
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
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

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes {
    email: string;
  }
}
