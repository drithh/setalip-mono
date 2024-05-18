'use client';

import { Button } from '@repo/ui/components/ui/button';
import { useForm } from 'react-hook-form';
import { resendOtp } from './_actions/resend-otp';
import { resendOtpSchema } from './form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import router from 'next/router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';

interface ResendOtpFormProps {
  userId: number;
}

export default function ResendOtpForm({ userId }: ResendOtpFormProps) {
  const [formState, formAction] = useFormState(resendOtp, {
    status: 'default',
    form: {
      userId: userId,
    },
  });

  const form = useForm<z.output<typeof resendOtpSchema>>({
    resolver: zodResolver(resendOtpSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'error') {
      toast.error('Gagal mengirim ulang kode OTP', {
        description: formState.errors,
        id: 'register-error',
      });
      form.setError('root', { message: formState.errors });
    }
    if (formState.status === 'success') {
      toast.success('Kode OTP berhasil dikirim ulang', {
        id: 'register-success',
      });
    }
  }, [formState.form]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            toast.loading('Mengirim ulang kode OTP...', {
              id: 'registering',
            });
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input type="hidden" readOnly placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 text-center text-sm">
          Belum dapat kode OTP?{' '}
          <Button className="p-1" variant={'link'}>
            Kirim ulang
          </Button>
        </div>
      </form>
    </Form>
  );
}
