('use server');
import { cookies } from 'next/headers';
import { UserService, UserValidationError } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { schema } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';

export type FormSchema = z.infer<typeof schema>;

export async function signup(
  state: FormState<FormSchema>,
  data: FormData
): Promise<FormState<FormSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);
  if (!parsed.success) {
    console.log('parsed', parsed.error.flatten);
    return {
      form: {
        email: data.get('email') as string,
        password: data.get('password') as string,
      },
      status: 'field-errors',
      errors: {
        email: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.email?.at(0),
        },
        password: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.password?.at(0),
        },
      },
    };
  }

  const userService = container.get<UserService>(TYPES.UserService);

  const { result, error } = await userService.loginUser({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error instanceof UserValidationError) {
    const errors = error.getErrors();

    const mappedErrors = convertErrorsToZod<FormSchema>(errors);

    console.log('error', mappedErrors);
    console.log('mappedErrors', mappedErrors);

    return {
      form: {
        ...parsed.data,
      },
      status: 'field-errors',
      errors: mappedErrors,
    };
  } else if (error) {
    return {
      form: {
        ...parsed.data,
      },
      status: 'error',
      errors: error.message,
    };
  }

  cookies().set(result.name, result.value, result.attributes);

  return redirect('/');
}
