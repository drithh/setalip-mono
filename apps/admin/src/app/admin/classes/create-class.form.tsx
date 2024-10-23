'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useActionState, useEffect, useRef, useState } from 'react';
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
import { CreateClassSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { createClassSchema } from './form-schema';
import { createClass } from './_actions/create-class';
import { SelectClassType } from '@repo/shared/repository';
import { Textarea } from '@repo/ui/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/ui/select';
import { AddonInput } from '@repo/ui/components/addon-input';

interface CreateClassFormProps {
  classTypes: SelectClassType[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat kelas',
  },
  loading: {
    title: 'Membuat kelas...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Kelas berhasil dibuat',
  },
};

export default function CreateClassForm({ classTypes }: CreateClassFormProps) {
  const router = useRouter();

  const [openSheet, setOpenSheet] = useState(false);

  const [formState, formAction] = useActionState(createClass, {
    status: 'default',
    form: {
      name: '',
      class_type_id: 0,
      description: '',
      duration: 0,
      slot: 0,
    },
  });

  type FormSchema = CreateClassSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(createClassSchema),
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
        <Button>Tambah</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Buat Kelas</SheetTitle>
          <SheetDescription className="text-left">
            Buat kelas, pastikan klik simpan ketika selesai.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              className="grid gap-4"
              ref={formRef}
              action={formAction}
              onSubmit={onFormSubmit}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Nama Kelas</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_type_id"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Tipe Kelas</FormLabel>
                    <FormControl>
                      <>
                        <Input type="hidden" {...field} />

                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe kelas" />
                          </SelectTrigger>
                          <SelectContent>
                            {classTypes.map((classType) => (
                              <SelectItem
                                key={classType.id}
                                value={classType.id.toString()}
                              >
                                {classType.type}
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
                name="description"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slot"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Slot</FormLabel>
                    <FormControl>
                      <AddonInput
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        endAdornment="Orang"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <AddonInput
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        endAdornment="Menit"
                      />
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
      </SheetContent>
    </Sheet>
  );
}
