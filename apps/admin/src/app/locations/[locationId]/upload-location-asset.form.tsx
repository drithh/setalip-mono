'use client';
import { FileDropzone } from '@repo/ui/components/file-dropzone';
import { useEffect, useRef, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import FileCard from './file-card';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import {
  UploadLocationAssetSchema,
  uploadLocationAssetSchema,
} from './form-schema';
import { uploadLocationAsset } from './_actions/upload-location-asset';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Button } from '@repo/ui/components/ui/button';
import { Dropzone } from '@repo/ui/components/dropzone';
import { Input } from '@repo/ui/components/ui/input';

type FileWithPreview = File & { preview: string };

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal mengunggah file',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mengunggah file...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'File berhasil diunggah',
  },
};

interface UploadLocationAssetProps {
  locationId: number;
}

export default function UploadLocationAsset({
  locationId,
}: UploadLocationAssetProps) {
  const router = useRouter();
  const [formState, formAction] = useFormState(uploadLocationAsset, {
    status: 'default',
    form: {
      locationId: locationId,
    },
  });

  type FormSchema = UploadLocationAssetSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(uploadLocationAssetSchema),
    defaultValues: formState.form,
  });

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const onUpload = async (files: File[]) => {
    // const formData = new FormData();
    // files.forEach((file) => {
    // formData.append('file', file);
    // });
    // setFiles([]);
    // router.refresh();
  };

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
    }
  }, [formState.form]);

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
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        {
          name: 'images',
          types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        },
        {
          name: 'videos',
          types: ['video/mp4', 'video/mpeg', 'video/quicktime'],
        },
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType?.types.find((type) => type === acceptedFiles[0]?.type),
      );
      if (!fileType && acceptedFiles === null) {
        form.setValue('files', []);
        form.setError('files', {
          message: 'File type is not valid',
          type: 'typeError',
        });
      } else {
        const arrFiles = Array.from(acceptedFiles);
        form.setValue('files', arrFiles);
        form.clearErrors('files');
      }
    } else {
      form.setValue('files', []);
      form.setError('files', {
        message: 'File is required',
        type: 'typeError',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="col-span-2 grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={onFormSubmit}
      >
        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input type="hidden" readOnly placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormControl>
                  <Dropzone
                    {...field}
                    multiple
                    dropMessage="Drop files or click here"
                    handleOnDrop={handleOnDrop}
                  />
                  {/* <>
                    <Input
                      type="file"
                      multiple
                      readOnly
                      placeholder=""
                      {...field}
                    />
                    <FileDropzone
                      value={field.value}
                      onValueChange={field.onChange}
                      multiple
                      maxFiles={3}
                      maxSize={8 * 1024 * 1024}
                    />
                  </> */}
                  {/* <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={4}
                    maxSize={4 * 1024 * 1024}
                    progresses={progresses}
                    // pass the onUpload function here for direct upload
                    // onUpload={uploadFiles}
                    disabled={isUploading}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        {files?.length ? (
          <PhotoProvider>
            <div className="grid grid-cols-2 gap-2">
              {files?.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  onDelete={() => {}}
                  progress={true}
                />
              ))}
            </div>
          </PhotoProvider>
        ) : null}
        <Button type="submit" className="w-full">
          Upload
        </Button>
      </form>
    </Form>
  );
}
