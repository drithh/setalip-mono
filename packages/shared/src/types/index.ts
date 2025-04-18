import { SelectQueryBuilder } from 'kysely';

export type PromiseResult<Result, Error> = Promise<
  | {
      result: Result;
      error: undefined;
    }
  | {
      result: undefined;
      error: Error;
    }
>;
export type ErrorFields<T extends string | number | symbol> = {
  [K in T]?: string;
};

export type QueryResult<T> = SelectQueryBuilder<any, any, T>;
