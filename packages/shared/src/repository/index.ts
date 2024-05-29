export * from '#dep/repository/user';
export * from '#dep/repository/location';
export * from '#dep/repository/otp';
export * from '#dep/repository/resetPassword';
export * from '#dep/repository/package';
export * from '#dep/repository/classType';

export type OptionalToRequired<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: T[P];
};
