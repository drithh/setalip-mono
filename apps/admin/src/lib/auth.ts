import { env } from '@/env';
import { NewLucia } from '@repo/shared/lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { createPool } from 'mysql2/promise';

const pool = createPool(env.DATABASE_URL);

const adapter = new Mysql2Adapter(pool, {
  user: 'users',
  session: 'user_sessions',
});

export const lucia = NewLucia(adapter, env.NODE_ENV === 'production');
