'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { signup } from './_actions/register-user';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Value as PhoneNumberValue } from 'react-phone-number-input';

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
      phoneNumber: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      email: '',
      address: '',
    },
  });

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    if (formState.status === 'field-errors') {
      if (formState.errors.phoneNumber) {
        form.setError('phoneNumber', formState.errors.phoneNumber);
      }
      if (formState.errors.password) {
        form.setError('password', formState.errors.password);
      }
      if (formState.errors.passwordConfirmation) {
        form.setError(
          'passwordConfirmation',
          formState.errors.passwordConfirmation
        );
      }
      if (formState.errors.name) {
        form.setError('name', formState.errors.name);
      }
      if (formState.errors.email) {
        form.setError('email', formState.errors.email);
      }
      if (formState.errors.address) {
        form.setError('address', formState.errors.address);
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
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormLabel>Nomor Whatsapp</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  value={field.value as PhoneNumberValue}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="address"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
}
