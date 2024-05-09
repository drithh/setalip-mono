import { Lucia, TimeSpan } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';

import { Kysely, PostgresDialect } from 'kysely';
import { env } from '@/env';
import { NewLucia } from '@repo/shared/lucia';
import { Pool } from 'pg';

const pool = new Pool();

const adapter = new NodePostgresAdapter(pool, {
  user: 'auth_users',
  session: 'user_sessions',
});

export const lucia = NewLucia(adapter, env.NODE_ENV === 'production');
