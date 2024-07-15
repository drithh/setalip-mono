'use client';

import { Button } from '@repo/ui/components/ui/button';
import { forgotPassword } from './_actions/forgot-password';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
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
import { ForgotPasswordSchema, forgotPasswordSchema } from './form-schema';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengirim link reset password',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengirim data...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Berhasil mengirim link reset password',
    description: 'Silahkan cek whatsapp anda',
  },
};

export default function ForgotPasswordForm() {
  const [formState, formAction] = useFormState(forgotPassword, {
    status: 'default',
    form: {
      phoneNumber: '',
    },
  });

  type FormSchema = ForgotPasswordSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      for (const fieldName in formState.errors) {
        if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
          const typedFieldName = fieldName as keyof FormSchema;
          const error = formState.errors[typedFieldName];
          if (error) {
            form.setError(typedFieldName, error);
          }
        }
      }
    } else if (formState.status === 'error') {
      toast.error(TOAST_MESSAGES.error.title, {
        description: TOAST_MESSAGES.error.description,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }
    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
    }
  }, [formState]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(() => {
      toast.loading(TOAST_MESSAGES.loading.title, {
        description: TOAST_MESSAGES.loading.description,
      });
      formAction(new FormData(formRef.current!));
    })(event);
  };

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={onSubmitForm}
      >
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
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

        <Button type="submit" className="w-full">
          Kirim
        </Button>
      </form>
    </Form>
  );
}
