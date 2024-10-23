'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SelectAgenda, SelectClass } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createAgendaBooking } from './_actions/create-agenda-booking';
import CreateAgendaBookingDialog from './confirmation.dialog';
import {
  CreateAgendaBookingSchema,
  createAgendaBookingSchema,
} from './form-schema';
import { SelectAgenda__Coach__Class__Location } from '@repo/shared/service';

interface CreateAgendaBookingProps {
  id: SelectAgenda['id'];
  time: string;
  agenda: SelectAgenda__Coach__Class__Location;
  class_name: SelectClass['name'];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat booking',
  },
  loading: {
    title: 'Membuat booking',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Booking berhasil dibuat',
  },
};

export default function CreateAgendaBooking({
  id,
  time,
  agenda,
  class_name,
}: CreateAgendaBookingProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  type FormSchema = CreateAgendaBookingSchema;

  const [formState, formAction] = useActionState(createAgendaBooking, {
    status: 'default',
    form: {
      agenda_id: id,
      time: agenda.time,
      agenda_recurrence_id: agenda.agenda_recurrence_id,
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

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input
                  type="hidden"
                  {...field}
                  value={agenda.time.toString()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agenda_recurrence_id"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input
                  type="hidden"
                  {...field}
                  value={agenda.agenda_recurrence_id ?? 0}
                />
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
