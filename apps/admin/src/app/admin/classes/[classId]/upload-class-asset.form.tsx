'use client';
import { useEffect, useRef } from 'react';
import { PhotoProvider } from 'react-photo-view';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { UploadClassAssetSchema, uploadClassAssetSchema } from './form-schema';
import { uploadClassAsset } from './_actions/upload-class-asset';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Dropzone } from '@repo/ui/components/dropzone';
import { Input } from '@repo/ui/components/ui/input';
import FileCard from '../../locations/[locationId]/_components/file-card';

type FileWithPreview = File & { preview: string };

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengunggah file',
  },
  loading: {
    title: 'Mengunggah file...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'File berhasil diunggah',
  },
};

interface UploadClassAssetProps {
  classId: number;
}

export default function UploadClassAsset({ classId }: UploadClassAssetProps) {
  const router = useRouter();
  const [formState, formAction] = useFormState(uploadClassAsset, {
    status: 'default',
    form: {
      classId: classId,
      files: [],
    },
  });

  type FormSchema = UploadClassAssetSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(uploadClassAssetSchema),
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
      form.reset({ files: [] });
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

  const formRef = useRef<HTMLFormElement>(null);

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (!acceptedFiles) {
      return;
    }

    const arrFiles = Array.from(acceptedFiles);
    form.setValue('files', arrFiles);
    form.clearErrors('files');
  }

  useEffect(() => {
    const files = form.getValues('files');
    if (files instanceof File || (Array.isArray(files) && files.length > 0)) {
      // submit form
      form.handleSubmit(() => {
        toast.loading(TOAST_MESSAGES.loading.title, {
          description: TOAST_MESSAGES.loading.description,
        });
        formAction(new FormData(formRef.current!));
      })();
    }
  }, [form.watch('files')]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={onFormSubmit}
      >
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <Input
              type="hidden"
              readOnly
              placeholder=""
              {...field}
              value={classId}
            />
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <>
                  {field.value && (
                    <PhotoProvider>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.isArray(field.value) ? (
                          field.value?.map((file, index) => (
                            <FileCard
                              file={{
                                ...file,
                                preview: URL.createObjectURL(file),
                              }}
                              key={index}
                              onDelete={() => {}}
                              progress={true}
                            />
                          ))
                        ) : (
                          <FileCard
                            file={{
                              ...field.value,
                              preview: URL.createObjectURL(field.value),
                            }}
                            onDelete={() => {}}
                            progress={true}
                          />
                        )}
                      </div>
                    </PhotoProvider>
                  )}
                  <div className="space-y-6">
                    <Dropzone
                      {...field}
                      multiple
                      accept="image/*,video/*"
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
      </form>
    </Form>
  );
}
