import 'reflect-metadata';

import { injectable } from 'inversify';
import { DB } from '@repo/shared/db';
import {
  Expression,
  Kysely,
  MysqlDialect,
  ParseJSONResultsPlugin,
  SelectQueryBuilder,
  SqlBool,
  Transaction,
} from 'kysely';
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
      console.info(event.query.sql);
      console.info(event.query.parameters);
    }
  },
});

export type DBTransaction = Transaction<DB>;

export interface Command {
  trx?: DBTransaction;
}

export interface Query<T> {
  filters?: Partial<T>;
  perPage?: number;
  offset?: number;
  orderBy?: `${Extract<keyof T, string>} ${'asc' | 'desc'}`[];
  customFilters?: Expression<SqlBool>[];
  compile?: boolean;
}
