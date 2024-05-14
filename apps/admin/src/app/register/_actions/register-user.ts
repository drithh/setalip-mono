'use server';
import { cookies } from 'next/headers';
import { UserService, UserValidationError } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { schema } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';
import { NotificationService } from '@repo/shared/notification';
import { UserRepository } from '@repo/shared/repository';

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
        phoneNumber: data.get('phoneNumber') as string,
        password: data.get('password') as string,
        passwordConfirmation: data.get('passwordConfirmation') as string,
        name: data.get('name') as string,
        email: data.get('email') as string,
        address: data.get('address') as string,
      },
      status: 'field-errors',
      errors: {
        phoneNumber: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.phoneNumber?.at(0),
        },
        password: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.password?.at(0),
        },
        passwordConfirmation: {
          type: 'required',
          message:
            parsed.error.formErrors.fieldErrors.passwordConfirmation?.at(0),
        },
        name: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.name?.at(0),
        },
        email: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.email?.at(0),
        },
        address: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.address?.at(0),
        },
      },
    };
  }

  const userService = container.get<UserService>(TYPES.UserService);
  const registerUser = await userService.registerUser({
    ...parsed.data,
  });

  if (registerUser.error instanceof UserValidationError) {
    const errors = registerUser.error.getErrors();

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
  } else if (registerUser.error) {
    return {
      form: {
        ...parsed.data,
      },
      status: 'error',
      errors: registerUser.error.message,
    };
  }

  // send notification
  const notificationService = container.get<NotificationService>(
    TYPES.NotificationService
  );

  const notification = await notificationService.sendNotification(
    'User registered',
    parsed.data.phoneNumber
  );

  if (notification.error) {
    return {
      form: {
        ...parsed.data,
      },
      status: 'error',
      errors: notification.error.message,
    };
  }

  console.log('notification', notification.result);

  cookies().set(
    registerUser.result.name,
    registerUser.result.value,
    registerUser.result.attributes
  );

  return redirect('/');
}
