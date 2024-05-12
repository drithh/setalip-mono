import { FieldError } from 'react-hook-form';

export function convertErrorsToZod<T>(
  errors: Record<string, string>
): Record<keyof T, FieldError> {
  return Object.keys(errors).reduce(
    (acc, key) => {
      const field = key as string;
      const message = errors[field];
      return {
        ...acc,
        [field]: {
          type: 'required',
          message: message,
        },
      };
    },
    {} as Record<keyof T, FieldError>
  );
}
