'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editPackageTransaction } from './_actions/edit-package-transaction';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
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
import {
  EditPackageTransactionSchema,
  editPackageTransactionSchema,
} from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SelectPackageTransaction } from '@repo/shared/repository';
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
import { Label } from '@repo/ui/components/ui/label';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface EditPackageTransactionProps {
  statuses: SelectPackageTransaction['status'][];
  singlePackageTransaction: SelectPackageTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui transaksi',
  },
  loading: {
    title: 'Memperbarui transaksi...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Transaksi berhasil diperbarui',
  },
};
type FileWithPreview = File & { preview: string };

export default function EditPackageTransactionForm({
  statuses,
  singlePackageTransaction,
  open,
  onOpenChange,
}: EditPackageTransactionProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditPackageTransactionSchema;

  const [formState, formAction] = useFormState(editPackageTransaction, {
    status: 'default',
    form: {
      id: singlePackageTransaction.id,
      status: singlePackageTransaction.status,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(editPackageTransactionSchema),
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
  const file = {
    preview: singlePackageTransaction.image_url,
    name: singlePackageTransaction.image_url,
  } as FileWithPreview;

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
            <SheetTitle className="text-left">Edit Transaksi</SheetTitle>
            <SheetDescription className="text-left">
              Edit transaksi. Pastikan klik simpan ketika selesai.
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
                {/* <div className="flex flex-col gap-4">
                  <Label>Bukti Transfer</Label>
                  <div className="group relative h-40 cursor-pointer overflow-hidden">
                    {singlePackageTransaction.image_url && (
                      <PhotoProvider>
                        <PhotoView src={singlePackageTransaction.image_url}>
                          <ImageWithFallback
                            className="aspect-square rounded-md object-contain"
                            fill
                            src={singlePackageTransaction.image_url}
                            alt={file.name || 'Image'}
                          />
                        </PhotoView>
                      </PhotoProvider>
                    )}
                  </div>
                </div> */}

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
                  name="status"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <>
                          <Input type="hidden" {...field} />

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status.toString()}
                                >
                                  {status}
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
