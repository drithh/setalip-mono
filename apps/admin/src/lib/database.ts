import { Database } from '@repo/shared/schema';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { env } from '@/env';

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
