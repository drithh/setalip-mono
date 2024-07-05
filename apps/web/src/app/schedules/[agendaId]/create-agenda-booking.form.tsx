'use client';

import {
  SelectAgenda,
  SelectAllDepositAccount,
  SelectClass,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { cn } from '@repo/ui/lib/utils';
import { useEffect, useRef, useState } from 'react';
import CreateAgendaBookingDialog from './confirmation.dialog';
import { useFormState } from 'react-dom';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { createAgendaBooking } from './_actions/create-agenda-booking';
import {
  CreateAgendaBookingSchema,
  createAgendaBookingSchema,
} from './form-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';

interface CreateAgendaBookingProps {
  id: SelectAgenda['id'];
  time: string;
  class_name: SelectClass['name'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat booking',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Membuat booking',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Booking berhasil dibuat, silahkan melakukan pembayaran',
  },
};

export default function CreateAgendaBooking({
  id,
  time,
  class_name,
}: CreateAgendaBookingProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  type FormSchema = CreateAgendaBookingSchema;

  const [formState, formAction] = useFormState(createAgendaBooking, {
    status: 'default',
    form: {
      agenda_id: id,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createAgendaBookingSchema),
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
        description: formState.errors,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title);
      router.push('/me/booking');
    }
  }, [formState]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
        ref={formRef}
        action={formAction}
        onSubmit={onFormSubmit}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="agenda_id"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input type="hidden" {...field} value={id} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="button" className="w-full" onClick={() => setOpen(true)}>
          Book Now
        </Button>
        <CreateAgendaBookingDialog
          open={open}
          onOpenChange={setOpen}
          time={time}
          class_name={class_name}
          onCreate={() =>
            form.handleSubmit(() => {
              toast.loading(TOAST_MESSAGES.loading.title, {
                description: TOAST_MESSAGES.loading.description,
              });
              formAction(new FormData(formRef.current!));
            })()
          }
        />
      </form>
    </Form>
  );
}
