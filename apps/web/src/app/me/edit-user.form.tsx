'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SelectLocation, SelectUser } from '@repo/shared/repository';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/ui/sheet';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';

import { api } from '@/trpc/react';

import { editUser } from './_actions/edit-user';
import { EditUserSchema, editUserSchema } from './form-schema';

interface EditUserProps {
  user: SelectUser;
  locations: SelectLocation[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui user',
  },
  loading: {
    title: 'Memperbarui user...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'User berhasil diperbarui',
  },
};

export default function EditUserForm({ user, locations }: EditUserProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditUserSchema;

  const [formState, formAction] = useFormState(editUser, {
    status: 'default',
    form: {
      ...user,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editUserSchema),
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
      router.refresh();
      trpcUtils.invalidate();
      setOpenSheet(false);
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
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Edit</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit User</SheetTitle>
            <SheetDescription className="text-left">
              Edit user. Pastikan klik simpan ketika selesai.
            </SheetDescription>
          </SheetHeader>
          <div className="l mb-6 grid gap-4 px-1 py-4">
            <Form {...form}>
              <form
                className="grid gap-4"
                ref={formRef}
                action={formAction}
                onSubmit={onFormSubmit}
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input id="name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={locations
                              .find((location) => location.id === field.value)
                              ?.id.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Lokasi" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id.toString()}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
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

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
