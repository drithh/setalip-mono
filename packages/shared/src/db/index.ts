import 'reflect-metadata';

import { injectable } from 'inversify';
import { DB } from '@repo/shared/db';
import { Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { env } from '#dep/env';
import { createPool } from 'mysql2/promise';
export * from '#dep/db/schema';

export const pool = createPool(env.DATABASE_URL);

const dialect = new MysqlDialect({
  pool: pool.pool,
});
@injectable()
export class Database extends Kysely<DB> {}

export const db = new Database({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
  log(event) {
    if (event.level === 'query') {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
});
