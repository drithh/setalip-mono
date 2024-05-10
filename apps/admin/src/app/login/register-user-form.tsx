'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { signup } from './_actions/register-user';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import Link from 'next/link';
import { schema } from './form-schema';

export default function RegisterUserForm() {
  const [formState, formAction] = useFormState(signup, {
    status: 'default',
    form: {
      email: '',
      password: '',
    },
  });

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    if (formState.status === 'field-errors') {
      console.log('formState', formState);
      if (formState.errors.email) {
        form.setError('email', formState.errors.email);
      }
      if (formState.errors.password) {
        form.setError('password', formState.errors.password);
      }
    } else if (formState.status === 'error') {
      form.setError('root', { message: formState.errors });
    }
  }, [formState.status]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            console.log('form', form);
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </form>
    </Form>
  );
}
