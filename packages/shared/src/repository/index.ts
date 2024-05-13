export * from '#dep/repository/user';

export type MakeKeyRequired<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};
