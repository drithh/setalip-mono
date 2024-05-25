import { injectable } from 'inversify';
import { DB } from '@repo/shared/db';
import { Kysely, MysqlDialect } from 'kysely';
import { env } from '#dep/env';
import { createPool } from 'mysql2/promise';
import 'reflect-metadata';
export * from '#dep/db/schema';

// const { hostname, password, port, username, pathname } = new URL(
// env.DATABASE_URL
// );

export const pool = createPool(env.DATABASE_URL);

// const poolConfig = createPool({
//   database: pathname.slice(1),
//   host: hostname,
//   user: username,
//   password,
//   port: Number(port),
//   connectionLimit: 5,
// });

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
