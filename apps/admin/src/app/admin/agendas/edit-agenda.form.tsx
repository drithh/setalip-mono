'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editAgenda } from './_actions/edit-agenda';
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
import { EditAgendaSchema, editAgendaSchema } from './form-schema';
import { toast } from 'sonner';
import { DatetimePicker } from '@repo/ui/components/datetime-picker';
import {
  SelectAgenda,
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
import { Switch } from '@repo/ui/components/ui/switch';
import { format } from 'date-fns';

interface EditAgendaProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
  agenda: SelectAgenda;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbaru agenda',
  },
  loading: {
    title: 'Memperbaru agenda...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Agenda berhasil diperbarui',
  },
};

export default function EditAgendaForm({
  locations,
  coaches,
  classes,
  agenda,
  open,
  onOpenChange,
}: EditAgendaProps) {
  const [selectedLocation, setSelectedLocation] = useState<SelectLocation>();
  const trpcUtils = api.useUtils();
  type FormSchema = EditAgendaSchema;

  const [formState, formAction] = useFormState(editAgenda, {
    status: 'default',
    form: {
      id: agenda.id,
      time: agenda.time,
      class_id: agenda.class_id,
      coach_id: agenda.coach_id,
      location_facility_id: agenda.location_facility_id,
      is_show: agenda.is_show,
      weekly_recurrence: agenda.weekly_recurrence,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editAgendaSchema),
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit Agenda</SheetTitle>
            <SheetDescription className="text-left">
              Edit agenda. Pastikan klik simpan ketika selesai.
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
                    <Input type="hidden" {...field} value={agenda.id} />
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
                      value={
                        `${
                          classes.find(
                            (singleClass) =>
                              singleClass.id ===
                              parseInt(form.getValues('class_id').toString()),
                          )?.duration
                        } menit` ?? ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="weekly_recurrence"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Weekly Recurrence</FormLabel>
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
                {form.watch('weekly_recurrence') === 1 && (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Recurrence Day</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        value={`Setiap ${format(form.watch('time'), 'EEEE')}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}

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
