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
import { EditWebSettingSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { SelectWebSetting } from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import { editWebSettingSchema } from './form-schema';
import { editWebSetting } from './_actions/edit-web-setting';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Dropzone } from '@repo/ui/components/dropzone';
import { PhotoProvider } from 'react-photo-view';
import FileCard from '../locations/[locationId]/_components/file-card';
import RichTextEditor from '@repo/ui/components/rich-text/text-editor';

interface EditWebSettingFormProps {
  webSetting: EditWebSettingSchema;
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengubah pengaturan',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengubah pengaturan...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Pengaturan berhasil diubah',
  },
};

type FileWithPreview = File & { preview: string };

export default function EditWebSettingForm({
  webSetting,
}: EditWebSettingFormProps) {
  const router = useRouter();
  const [imageRemoved, setImageRemoved] = useState(false);

  const [openSheet, setOpenSheet] = useState(false);

  const [formState, formAction] = useFormState(editWebSetting, {
    status: 'default',
    form: {
      instagram_handle: webSetting.instagram_handle,
      tiktok_handle: webSetting.tiktok_handle,
      logo: null,
      terms_and_conditions: webSetting.terms_and_conditions,
      privacy_policy: webSetting.privacy_policy,
      url:
        webSetting.url && webSetting.url.length > 0
          ? webSetting.url
          : undefined,
    },
  });

  type FormSchema = EditWebSettingSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(editWebSettingSchema),
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
      setOpenSheet(false);
      router.refresh();
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

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      form.setError('logo', { message: 'File tidak valid' });
      return;
    }
    const file = acceptedFiles[0];

    if (!file) {
      form.setError('logo', { message: 'File tidak valid' });
      return;
    }

    form.setValue('logo', file);
    form.clearErrors('logo');
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant={'outline'}>Edit</Button>
      </SheetTrigger>
      <SheetContent className="overflow-scroll sm:max-w-[52rem]">
        <SheetHeader>
          <SheetTitle className="text-left">Edit Detail Lokasi</SheetTitle>
          <SheetDescription className="text-left">
            Buat perubahan pada detail lokasi, pastikan klik simpan ketika
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
              {/* <Input
                {...form.register('url')}
                value={webSetting.url ?? undefined}
              /> */}
              {/* <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormControl></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {webSetting.url && (
                <Input
                  type="hidden"
                  {...form.register('url')}
                  value={webSetting.url ?? undefined}
                />
              )}

              <FormField
                control={form.control}
                name="instagram_handle"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok_handle"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Tiktok</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <>
                        <FormLabel>Foto</FormLabel>
                        {field.value && field.value.size !== 0 ? (
                          <PhotoProvider>
                            <div className="grid grid-cols-2 gap-2">
                              <FileCard
                                file={{
                                  ...field.value,
                                  preview: URL.createObjectURL(field.value),
                                }}
                                onDelete={() => {
                                  form.setValue('logo', null);
                                }}
                              />
                            </div>
                          </PhotoProvider>
                        ) : (
                          webSetting.url &&
                          !imageRemoved && (
                            <PhotoProvider>
                              <div className="grid grid-cols-2 gap-2">
                                <FileCard
                                  file={
                                    {
                                      preview: webSetting.url,
                                      name: 'Logo',
                                    } as FileWithPreview
                                  }
                                  onDelete={() => {
                                    setImageRemoved(true);
                                  }}
                                />
                              </div>
                            </PhotoProvider>
                          )
                        )}
                        <div className="space-y-6">
                          <Dropzone
                            {...field}
                            accept="image/*"
                            dropMessage="Tarik dan lepas file di sini atau klik untuk memilih file"
                            handleOnDrop={handleOnDrop}
                          />
                        </div>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacy_policy"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Privacy Policy</FormLabel>
                    <FormControl>
                      <>
                        <Input type="hidden" {...field} />
                        <RichTextEditor
                          value={field.value}
                          onChange={(value) =>
                            form.setValue('privacy_policy', value)
                          }
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms_and_conditions"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <>
                        <Input type="hidden" {...field} />
                        <RichTextEditor
                          value={field.value}
                          onChange={(value) =>
                            form.setValue('terms_and_conditions', value)
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
      </SheetContent>
    </Sheet>
  );
}
