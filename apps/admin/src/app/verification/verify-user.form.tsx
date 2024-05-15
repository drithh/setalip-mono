'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { PasswordInput } from '@repo/ui/components/password-input';
import { verifyUser } from './_actions/verify-user';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Value as PhoneNumberValue } from 'react-phone-number-input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import Link from 'next/link';
import { verifyOtpSchema } from './form-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAuth } from '../get-auth';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@repo/ui/components/ui/input-otp';

interface VerifyUserFormProps {
  userId: number;
}

export default function VerifyUserForm({ userId }: VerifyUserFormProps) {
  const router = useRouter();

  const [formState, formAction] = useFormState(verifyUser, {
    status: 'default',
    form: {
      userId: userId,
      otp: '',
    },
  });

  const form = useForm<z.output<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      if (formState.errors.otp) {
        form.setError('otp', formState.errors.otp);
      }
    } else if (formState.status === 'error') {
      toast.error('Verifikasi gagal', {
        description: formState.errors,
        id: 'register-error',
        duration: 5000,
      });
      form.setError('root', { message: formState.errors });
    }
    if (formState.status === 'success') {
      toast.success('Verifikasi berhasil', {
        id: 'register-success',
        duration: 5000,
      });
      router.push('/');
    }
  }, [formState.form]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          toast.loading('Verifikasi User...', {
            id: 'registering',
          });
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="w-full grid gap-2">
              <FormControl>
                <Input type="hidden" readOnly placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex place-content-center">
                Kode OTP
              </FormLabel>
              <FormControl>
                <div className="flex place-content-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Verifikasi
        </Button>
      </form>
    </Form>
  );
}
