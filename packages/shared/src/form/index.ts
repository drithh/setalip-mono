import { FieldError } from 'react-hook-form';

export type FormState<T> = { form: Partial<T> | undefined } & (
  | SuccessState
  | SubmitErrorState
  | FieldErrorsState<T>
  | DefaultState
);

type FieldErrorsState<T> = {
  status: 'field-errors';
  errors: Partial<Record<keyof T, FieldError>>;
};

type DefaultState = {
  status: 'default';
};

type SubmitErrorState = {
  status: 'error';
  errors: string;
};

type SuccessState = {
  status: 'success';
};
