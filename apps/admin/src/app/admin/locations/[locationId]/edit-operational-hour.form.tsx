'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useFormState } from 'react-dom';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
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
import { EditOperationalHourSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SelectDetailLocation } from '@repo/shared/repository';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { SelectLocation } from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { editOperationalHourSchema } from './form-schema';
import { editOperationalHour } from './_actions/edit-operational-hour';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { TimePickerInput } from '@repo/ui/components/time-picker-input';

interface EditOperationalHourFormProps {
  location: SelectDetailLocation;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengubah waktu operasional',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengubah waktu operasional...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Waktu operasional berhasil diubah',
  },
};

export default function EditOperationalHourForm({
  location,
}: EditOperationalHourFormProps) {
  const router = useRouter();

  const [openSheet, setOpenSheet] = useState(false);

  const convertTimeToDateTime = (time: string = '00:00:00') => {
    const [hours, minutes, seconds] = time.split(':');
    // use 2000-01-01 as a base date
    return new Date(
      2000,
      0,
      1,
      Number(hours),
      Number(minutes),
      Number(seconds),
      0,
    );
  };

  const days = [0, 1, 2, 3, 4, 5, 6];

  const [formState, formAction] = useFormState(editOperationalHour, {
    status: 'default',
    form: {
      locationId: location.id,
      operationalHour: days.map((day) => {
        const operationalHour = location.operational_hours.find(
          (operationalHour) => operationalHour.day_of_week === day,
        );
        return {
          operationalHourId: operationalHour?.id,
          day: day,
          check: !!operationalHour,
          openingTime: operationalHour?.opening_time ?? '00:00:00',
          closingTime: operationalHour?.closing_time ?? '00:00:00',
        };
      }),
    },
  });

  type FormSchema = EditOperationalHourSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(editOperationalHourSchema),
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
  const mapDayOfWeek = (dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 0:
        return 'Senin';
      case 1:
        return 'Selasa';
      case 2:
        return 'Rabu';
      case 3:
        return 'Kamis';
      case 4:
        return 'Jumat';
      case 5:
        return 'Sabtu';
      case 6:
        return 'Minggu';
      default:
        return '';
    }
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Edit</Button>
      </SheetTrigger>
      <SheetContent className="w-[440px] max-w-[440px]">
        <SheetHeader>
          <SheetTitle className="text-left">Edit Waktu Operasional</SheetTitle>
          <SheetDescription className="text-left">
            Buat perubahan pada waktu operasional lokasi, pastikan klik simpan
            ketika selesai.
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
                name="locationId"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              {days.map((day) => {
                const hourOpenRef = useRef<HTMLInputElement>(null);
                const minuteOpenRef = useRef<HTMLInputElement>(null);

                const hourCloseRef = useRef<HTMLInputElement>(null);
                const minuteCloseRef = useRef<HTMLInputElement>(null);

                const [openingTime, setOpeningTime] = useState(
                  convertTimeToDateTime(
                    formState?.form?.operationalHour?.at(day)?.openingTime ??
                      '00:00:00',
                  ),
                );

                const [closingTime, setClosingTime] = useState(
                  convertTimeToDateTime(
                    formState?.form?.operationalHour?.at(day)?.closingTime ??
                      '00:00:00',
                  ),
                );

                const updateHour = (time: string, date: Date) => {
                  const hours = `0${date.getHours()}`.slice(-2);
                  const times = time.split(':');

                  const updatedDate = `${hours}:${times[1]}:${times[2]}`;
                  return updatedDate;
                };

                const updateMinute = (time: string, date: Date) => {
                  const minutes = `0${date.getMinutes()}`.slice(-2);
                  const times = time.split(':');
                  const updatedDate = `${times[0]}:${minutes}:${times[2]}`;
                  return updatedDate;
                };

                return (
                  <div key={day} className="flex flex-col">
                    <div className="flex place-content-between">
                      <div className="flex place-items-center gap-3">
                        <FormField
                          control={form.control}
                          name={`operationalHour.${day}.check`}
                          render={({ field }) => (
                            <FormItem className="grid w-full gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(value) =>
                                    field.onChange(value)
                                  }
                                  ref={field.ref}
                                  name={field.name}
                                  value={field.value ? 'true' : 'false'}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`operationalHour.${day}.day`}
                          render={({ field }) => (
                            <FormItem className="grid w-full gap-2">
                              <FormControl>
                                <div className="flex place-items-center gap-2">
                                  <FormLabel className="text-[1.05rem]">
                                    {mapDayOfWeek(field.value)}
                                    <Input type="hidden" {...field} />
                                  </FormLabel>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex place-items-center gap-3">
                        <FormField
                          control={form.control}
                          name={`operationalHour.${day}.openingTime`}
                          render={({ field }) => (
                            <FormItem className="grid w-full gap-2">
                              <FormControl>
                                <div className="flex place-items-center gap-2">
                                  <Input
                                    type="hidden"
                                    {...field}
                                    value={field.value}
                                  />
                                  <TimePickerInput
                                    picker="hours"
                                    date={openingTime}
                                    setDate={(date) => {
                                      if (date) {
                                        field.onChange(
                                          updateHour(field.value, date),
                                        );
                                        setOpeningTime(date);
                                      }
                                    }}
                                    ref={hourOpenRef}
                                    onRightFocus={() =>
                                      minuteOpenRef.current?.focus()
                                    }
                                  />
                                  <p>:</p>
                                  <TimePickerInput
                                    picker="minutes"
                                    date={openingTime}
                                    setDate={(date) => {
                                      if (date) {
                                        field.onChange(
                                          updateMinute(field.value, date),
                                        );
                                        setOpeningTime(date);
                                      }
                                    }}
                                    ref={minuteOpenRef}
                                    onLeftFocus={() =>
                                      hourOpenRef.current?.focus()
                                    }
                                    onRightFocus={() =>
                                      hourCloseRef.current?.focus()
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <p>-</p>
                        <FormField
                          control={form.control}
                          name={`operationalHour.${day}.closingTime`}
                          render={({ field }) => (
                            <FormItem className="grid w-full gap-1">
                              <FormControl>
                                <div className="flex place-items-center gap-2">
                                  <Input
                                    type="hidden"
                                    {...field}
                                    value={field.value.toString()}
                                  />
                                  <TimePickerInput
                                    picker="hours"
                                    date={closingTime}
                                    setDate={(date) => {
                                      if (date) {
                                        field.onChange(
                                          updateHour(field.value, date),
                                        );
                                        setClosingTime(date);
                                      }
                                    }}
                                    ref={hourCloseRef}
                                    onLeftFocus={() =>
                                      minuteOpenRef.current?.focus()
                                    }
                                    onRightFocus={() =>
                                      minuteCloseRef.current?.focus()
                                    }
                                  />
                                  <p>:</p>
                                  <TimePickerInput
                                    picker="minutes"
                                    date={closingTime}
                                    setDate={(date) => {
                                      if (date) {
                                        field.onChange(
                                          updateMinute(field.value, date),
                                        );
                                        setClosingTime(date);
                                      }
                                    }}
                                    ref={minuteCloseRef}
                                    onLeftFocus={() =>
                                      hourCloseRef.current?.focus()
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {/* error for root */}
                    <FormMessage className="pr-1 text-right">
                      {(form?.formState?.errors?.operationalHour &&
                        form.formState.errors.operationalHour[day]?.root
                          ?.message) ??
                        ''}
                    </FormMessage>
                  </div>
                );
              })}
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
