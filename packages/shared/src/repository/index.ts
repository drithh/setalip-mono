export * from '#dep/repository/user';
export * from '#dep/repository/location';
export * from '#dep/repository/otp';
export * from '#dep/repository/resetPassword';
export * from '#dep/repository/package';
export * from '#dep/repository/classType';
export * from '#dep/repository/agenda';
export * from '#dep/repository/class';
export * from '#dep/repository/coach';
export * from '#dep/repository/credit';
export * from '#dep/repository/loyalty';

export type DefaultPagination = {
  page?: number;
  perPage?: number;
  sort?: string;
};

export type OptionalToRequired<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: T[P];
};
