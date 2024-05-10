import { Database } from '@repo/shared/schema';
import { Kysely, MysqlDialect } from 'kysely';
import { env } from '@/env';
import { createPool } from 'mysql2/promise';

export const pool = createPool(env.DATABASE_URL);

const dialect = new MysqlDialect({
  pool: pool.pool,
});

export const db = new Kysely<Database>({
  dialect,
  log(event) {
    if (event.level === 'query') {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
});
