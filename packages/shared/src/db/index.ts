import { injectable } from 'inversify';
import { DB } from '@repo/shared/db';
import { Kysely, MysqlDialect } from 'kysely';
import { env } from '#dep/env';
import { createPool } from 'mysql2/promise';

export * from '#dep/db/schema';
console.log(env.DATABASE_URL);
export const pool = createPool(
  'mariadb://setalip:setalip@localhost:3306/setalip'
);

const dialect = new MysqlDialect({
  pool: pool.pool,
});

@injectable()
export class Database extends Kysely<DB> {}

export const db = new Database({
  dialect,
  log(event) {
    if (event.level === 'query') {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
});
