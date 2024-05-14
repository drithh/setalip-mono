export * from '#dep/service/user';

export type ErrorFields<T extends string | number | symbol> = {
  [K in T]?: string;
};
