'use server';
import { hash } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { lucia } from '@repo/shared/auth';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { schema } from '../form-schema';

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

  const hashed_password = await hash(parsed.data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userRepo = container.get<UserRepository>(TYPES.UserRepository);

  const existingUser = await userRepo.FindUserByEmail(parsed.data.email);

  if (existingUser) {
    console.log('existingUser', existingUser);
    return {
      form: parsed.data,
      status: 'field-errors',
      errors: { email: { type: 'required', message: 'Email already exists' } },
    };
  }

  const inserted = await userRepo.CreateUser({
    email: parsed.data.email,
    hashed_password,
  });

  if (!inserted) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'Failed to create user',
    };
  }

  const insertedId = Number(inserted.insertId);
  const session = await lucia.createSession(insertedId, {
    user_id: insertedId,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
