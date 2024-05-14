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
