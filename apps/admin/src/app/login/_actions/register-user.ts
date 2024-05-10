'use server';

import { db } from '@/lib/database';
import { hash } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { redirect } from 'next/navigation';

function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}

type CreateItemState = { form: Form } & (
  | SuccessState
  | SubmitErrorState
  | FieldErrorsState
  | DefaultState
);

type Form = {
  email: string;
  password: string;
};

type FieldErrorsState = {
  status: 'field-errors';
  errors: Partial<Record<keyof Form, string>>;
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

export async function signup(
  state: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  console.log('formData', formData);

  const submittedForm = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log('submittedForm', submittedForm);

  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive

  if (!isValidEmail(submittedForm.email)) {
    return {
      form: submittedForm,
      status: 'field-errors',
      errors: { email: 'Invalid email' },
    };
  }

  if (
    submittedForm.password.length < 6 ||
    submittedForm.password.length > 255
  ) {
    return {
      form: submittedForm,
      status: 'field-errors',
      errors: { password: 'Password must be between 6 ~ 255 characters' },
    };
  }

  const hashed_password = await hash(submittedForm.password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // TODO: check if username is already used
  const user = await db
    .insertInto('users')
    .values({
      email: submittedForm.email,
      hashed_password: hashed_password,
    })
    .returning(['users.email', 'users.id'])
    .executeTakeFirstOrThrow();

  console.log('user', user);
  const session = await lucia.createSession(1, {
    user_id: 1,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
