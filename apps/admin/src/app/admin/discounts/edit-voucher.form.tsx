'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editVoucher } from './_actions/edit-voucher';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { EditVoucherSchema, editVoucherSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Switch } from '@repo/ui/components/ui/switch';
import {
  SelectAllUserName,
  SelectVoucher,
  SelectVoucherWithUser,
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
import { DatetimePicker } from '@repo/ui/components/datetime-picker';
import { isBefore, subDays } from 'date-fns';
import { AddonInput } from '@repo/ui/components/addon-input';
import { MoneyInput } from '@repo/ui/components/money-input';

interface EditVoucherProps {
  data: SelectVoucherWithUser;
  users: SelectAllUserName;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui voucher',
  },
  loading: {
    title: 'Memperbarui voucher',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Voucher berhasil diperbarui',
  },
};

export default function EditVoucherForm({
  data,
  users,
  open,
  onOpenChange,
}: EditVoucherProps) {
  const [isAllUser, setIsAllUser] = useState(
    data.user_id === null ? true : false,
  );

  const trpcUtils = api.useUtils();
  const router = useRouter();

  type FormSchema = EditVoucherSchema;

  const types = ['percentage', 'fixed'] satisfies SelectVoucher['type'][];

  const [formState, formAction] = useActionState(editVoucher, {
    status: 'default',
    form: {
      id: data.id,
      code: data.code,
      type: data.type,
      discount: data.discount,
      expired_at: data.expired_at,
      user_id: data.user_id,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editVoucherSchema),
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
        form.reset();
        onOpenChange(ev);
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit Voucher</SheetTitle>
            <SheetDescription className="text-left">
              Edit Voucher. Pastikan klik simpan ketika selesai.
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
                        <Input
                          type="hidden"
                          {...field}
                          value={data.id.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="grid w-full gap-2">
                  <FormLabel>Set voucher untuk semua user</FormLabel>
                  <FormControl>
                    <Switch
                      checked={isAllUser}
                      onCheckedChange={(e) => {
                        setIsAllUser(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {!isAllUser && (
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem className="grid w-full gap-2">
                        <FormLabel>User</FormLabel>
                        <FormControl>
                          <>
                            <Input type="hidden" {...field} />

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih user" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem
                                    key={user.id}
                                    value={user.id.toString()}
                                  >
                                    {user.name}
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
                )}

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input id="code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Type</FormLabel>
                      <FormDescription>
                        Pilih jenis diskon yang akan diberikan. (diskon persen /
                        rupiah)
                      </FormDescription>
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
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        {form.getValues('type') === 'fixed' ? (
                          <MoneyInput {...field} className="w-full" />
                        ) : (
                          <AddonInput
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            endAdornment="%"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expired_at"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Expired At</FormLabel>
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
                              isBefore(date, subDays(new Date(), 1))
                            }
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
