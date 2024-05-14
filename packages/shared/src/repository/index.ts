export * from '#dep/repository/user';

export type OptionalToRequired<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: T[P];
};
