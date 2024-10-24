'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { createAgenda } from './_actions/create-agenda';
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
import { CreateAgendaSchema, createAgendaSchema } from './form-schema';
import { toast } from 'sonner';
import { DatetimePicker } from '@repo/ui/components/datetime-picker';
import {
  SelectClass,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { api } from '@/trpc/react';
import { Switch } from '@repo/ui/components/ui/switch';

interface CreateAgendaProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat agenda',
  },
  loading: {
    title: 'Membuat agenda...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Agenda berhasil dibuat',
  },
};

export default function CreateAgendaForm({
  locations,
  coaches,
  classes,
}: CreateAgendaProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<SelectLocation>();
  const trpcUtils = api.useUtils();
  type FormSchema = CreateAgendaSchema;

  const [formState, formAction] = useActionState(createAgenda, {
    status: 'default',
    form: {
      time: new Date(),
      class_id: 0,
      coach_id: 0,
      location_facility_id: 0,

      is_show: 1,
      weekly_recurrence: 0,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createAgendaSchema),
    defaultValues: formState.form,
  });

  const locationFacilities = api.location.findAllFacilityById.useQuery(
    {
      id: selectedLocation?.id ?? -1,
    },
    {
      enabled: !!selectedLocation,
    },
  );

  useEffect(() => {
    if (formState.status === 'field-errors') {
      toast.dismiss();
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
      toast.dismiss();
      toast.error(TOAST_MESSAGES.error.title, {
        description: formState.errors,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.dismiss();
      toast.success(TOAST_MESSAGES.success.title);
      form.reset();
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
        <Button variant={'outline'}>Tambah</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Buat Agenda</SheetTitle>
            <SheetDescription className="text-left">
              Buat agenda baru. Pastikan klik simpan ketika selesai.
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
                  name="class_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Kelas</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((singleClass) => (
                                <SelectItem
                                  key={singleClass.id}
                                  value={singleClass.id.toString()}
                                >
                                  {singleClass.name}
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
                  name="is_show"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Show agenda</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(e) => {
                              field.onChange(e ? 1 : 0);
                            }}
                          />
                        </>
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
                      <FormLabel>Waktu Agenda</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="hidden"
                            {...field}
                            value={field.value.toString()}
                          />
                          <DatetimePicker
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1),
                              )
                            }
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="grid w-full gap-2">
                  <FormLabel>Durasi Kelas</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      value={`${
                        classes.find(
                          (singleClass) =>
                            singleClass.id.toString() ===
                            form.getValues('class_id').toString(),
                        )?.duration ?? ''
                      } menit`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="coach_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Instruktur</FormLabel>

                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {coaches.map((coach) => (
                                <SelectItem
                                  key={coach.id}
                                  value={coach.id.toString()}
                                >
                                  {coach.name}
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

                <FormItem className="grid w-full gap-2">
                  <FormLabel>Lokasi</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const location = locations.find(
                        (location) => location.id === parseInt(value),
                      );
                      if (location) {
                        setSelectedLocation(location);
                        form.setValue('location_facility_id', 0);
                      }
                    }}
                    defaultValue={selectedLocation?.id.toString() ?? ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi" />
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
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="location_facility_id"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Fasilitas</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih fasilitas" />
                            </SelectTrigger>
                            <SelectContent>
                              {locationFacilities.data?.result?.map(
                                (locationFacility) => (
                                  <SelectItem
                                    key={locationFacility.id}
                                    value={locationFacility.id.toString()}
                                  >
                                    {locationFacility.name}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
