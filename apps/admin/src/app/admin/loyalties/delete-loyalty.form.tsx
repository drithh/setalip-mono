'use client';

import { Button } from '@repo/ui/components/ui/button';
import { useState } from 'react';


import { SelectAllUserName } from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';


import { ScrollArea } from '@repo/ui/components/ui/scroll-area';

interface DeleteLoyaltyProps {
  users: SelectAllUserName;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengurangi point loyalty',
  },
  loading: {
    title: 'Mengurangi point loyalty...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Point loyalty berhasil dikurangi',
  },
};

export default function DeleteLoyaltyForm({ users }: DeleteLoyaltyProps) {
  const [openSheet, setOpenSheet] = useState(false);

  // const trpcUtils = api.useUtils();
  // const router = useRouter();
  // type FormSchema = DeleteLoyaltySchema;

  // const [formState, formAction] = useFormState(deleteLoyalty, {
  //   status: 'default',
  //   form: {
  //     amount: 0,
  //   } as FormSchema,
  // });

  // const form = useForm<FormSchema>({
  //   resolver: zodResolver(deleteLoyaltySchema),
  //   defaultValues: formState.form,
  // });

  // useEffect(() => {
  //   toast.dismiss();
  //   if (formState.status === 'field-errors') {
  //     for (const fieldName in formState.errors) {
  //       if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
  //         const typedFieldName = fieldName as keyof FormSchema;
  //         const error = formState.errors[typedFieldName];
  //         if (error) {
  //           form.setError(typedFieldName, error);
  //         }
  //       }
  //     }
  //   } else if (formState.status === 'error') {
  //     toast.error(TOAST_MESSAGES.error.title, {
  //       description: formState.errors,
  //     });
  //     form.setError('root', { message: formState.errors });
  //   } else {
  //     form.clearErrors();
  //   }

  //   if (formState.status === 'success') {
  //     toast.success(TOAST_MESSAGES.success.title);
  //     form.reset();
  //     trpcUtils.invalidate();
  //     setOpenSheet(false);
  //   }
  // }, [formState]);

  // const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   form.handleSubmit(() => {
  //     toast.loading(TOAST_MESSAGES.loading.title, {
  //       description: TOAST_MESSAGES.loading.description,
  //     });
  //     formAction(new FormData(formRef.current!));
  //   })(event);
  // };

  // const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Kurangi</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Kurangi Loyalty point</SheetTitle>
            <SheetDescription className="text-left">
              Kurangi loyalty point user. Pastikan klik simpan ketika selesai.
            </SheetDescription>
          </SheetHeader>
          <div className="l mb-6 grid gap-4 px-1 py-4">
            {/* <Form {...form}>
              <form
                className="grid gap-4"
                ref={formRef}
                action={formAction}
                onSubmit={onFormSubmit}
              >
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
                            defaultValue={field.value.toString()}
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

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Loyalty Point</FormLabel>
                      <FormDescription>
                        Jumlah point yang diberikan kepada pengguna
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Note</FormLabel>
                      <FormDescription>
                        Catatan kenapa memberikan loyalty point
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form> */}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
