import { injectable } from 'inversify';
import { DatabaseSchema } from '../schema/index.js';
import { Kysely, MysqlDialect } from 'kysely';
import { env } from '#dep/env';
import { createPool } from 'mysql2/promise';

export const pool = createPool(env.DATABASE_URL);

const dialect = new MysqlDialect({
  pool: pool.pool,
});

@injectable()
export class Database extends Kysely<DatabaseSchema> {}

export const db = new Database({
  dialect,
  log(event) {
    if (event.level === 'query') {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
});
