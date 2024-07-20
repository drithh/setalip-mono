'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
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
import { EditDetailClassSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import {
  SelectClass,
  SelectClassType,
  SelectClassWithAsset,
  SelectDetailClassAssetAndLocation,
  SelectLocation,
} from '@repo/shared/repository';
import { MultiSelect } from '@repo/ui/components/multi-select';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { editDetailClassSchema } from './form-schema';
import { editDetailClass } from './_actions/edit-detail-class';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { AddonInput } from '@repo/ui/components/addon-input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/ui/select';

interface EditDetailClassFormProps {
  singleClass: SelectDetailClassAssetAndLocation;
  classTypes: SelectClassType[];
  locations: SelectLocation[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengubah detail kelas',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengubah detail kelas...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Detail kelas berhasil diubah',
  },
};

export default function EditDetailClassForm({
  singleClass,
  classTypes,
  locations,
}: EditDetailClassFormProps) {
  const router = useRouter();

  const [openSheet, setOpenSheet] = useState(false);

  const [formState, formAction] = useFormState(editDetailClass, {
    status: 'default',
    form: {
      class_id: singleClass.id,
      class_type_id: singleClass.class_type_id,
      name: singleClass.name,
      description: singleClass.description,
      slot: singleClass.slot,
      duration: singleClass.duration,
      class_locations: singleClass.locations
        ?.map((location) => location.location_id.toString())
        .join(','),
    },
  });

  const [selectedLocation, setSelectedLocation] = useState<
    {
      value: string;
      label: string;
    }[]
  >(
    singleClass.locations?.map((location) => ({
      value: location.location_id.toString(),
      label: location.name,
    })) || [],
  );

  type FormSchema = EditDetailClassSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(editDetailClassSchema),
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
        <Button variant={'outline'}>Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Edit Detail Kelas</SheetTitle>
          <SheetDescription className="text-left">
            Buat perubahan pada detail kelas, pastikan klik simpan ketika
            selesai.
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
                name="class_id"
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

              <FormField
                control={form.control}
                name="class_locations"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Tersedia Di Lokasi</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="hidden"
                          {...field}
                          value={selectedLocation
                            .map((location) => location.value)
                            .join(',')}
                        />
                        <MultiSelect
                          options={locations.map((location) => ({
                            label: location.name,
                            value: location.id.toString(),
                          }))}
                          placeholder="Pilih lokasi"
                          selected={selectedLocation}
                          setSelected={setSelectedLocation}
                        />
                      </>
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
