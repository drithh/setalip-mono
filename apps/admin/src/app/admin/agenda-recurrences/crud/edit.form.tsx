'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { edit } from './_actions/edit';
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
import { EditSchema, editSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  SelectClass,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import {
  Sheet,
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
import { CONSTANT, DAYS } from './constant';
import { TimePicker } from '@repo/ui/components/datetime-picker';
import { parse, format } from 'date-fns';
import { DatePicker } from '@repo/ui/components/date-picker';
import { SelectAgendaRecurrence__Coach__Class__Location } from '@repo/shared/service';

interface EditProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
  data: SelectAgendaRecurrence__Coach__Class__Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: `Gagal memperbarui ${CONSTANT.Item}`,
  },
  loading: {
    title: `Memperbarui ${CONSTANT.Item}...`,
    description: 'Mohon tunggu',
  },
  success: {
    title: `${CONSTANT.Item} berhasil diperbarui`,
  },
};

export default function EditForm({
  locations,
  coaches,
  classes,
  data,
  open,
  onOpenChange,
}: EditProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditSchema;

  const [formState, formAction] = useActionState(edit, {
    status: 'default',
    form: {
      time: data.time,
      day_of_week: data.day_of_week,
      class_id: data.class_id,
      coach_id: data.coach_id,
      location_facility_id: data.location_facility_id,
      start_date: data.start_date,
      end_date: data.end_date,
      id: data.id,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editSchema),
    defaultValues: formState.form,
  });

  const [selectedLocation, setSelectedLocation] =
    useState<SelectLocation | null>(
      locations.find((location) => location.id === data.location_id) ?? null,
    );
  const locationFacilities = api.location.findAllFacilityById.useQuery(
    {
      id: selectedLocation?.id ?? -1,
    },
    {
      enabled: !!selectedLocation,
    },
  );

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
      trpcUtils.invalidate();
      router.refresh();
      onOpenChange(false);
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
    <Sheet
      open={open}
      onOpenChange={(ev) => {
        onOpenChange(ev);
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left capitalize">
              Edit {CONSTANT.Item}
            </SheetTitle>
            <SheetDescription className="text-left">
              Edit {CONSTANT.Item}. Pastikan klik simpan ketika selesai.
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
                        <Input type="hidden" {...field} value={data.id} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="day_of_week"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Hari</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih hari" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day, index) => (
                                <SelectItem key={day} value={index.toString()}>
                                  {day}
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
                          <TimePicker
                            date={parse(field.value, 'HH:mm:ss', new Date())}
                            setDate={(value) => {
                              field.onChange(format(value, 'HH:mm:ss'));
                            }}
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

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="hidden"
                            {...field}
                            value={field.value.toString()}
                          />

                          <DatePicker
                            className="w-full"
                            selected={field.value}
                            setSelected={field.onChange}
                            disabled={(date) => {
                              const endDate = form.getValues('end_date');
                              return (
                                !endDate ||
                                date > endDate ||
                                date < data.start_date
                              );
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Tanggal Selesai</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="hidden"
                            {...field}
                            value={field.value.toString()}
                          />

                          <DatePicker
                            className="w-full"
                            selected={field.value}
                            setSelected={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues('start_date');
                              return !startDate || date < startDate;
                            }}
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
