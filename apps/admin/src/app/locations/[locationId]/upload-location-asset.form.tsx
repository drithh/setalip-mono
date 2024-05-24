'use client';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { FileDropzone } from '@repo/ui/components/file-dropzone';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@repo/ui/components/ui/alert-dialog';
import { Button } from '@repo/ui/components/ui/button';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import FileCard from './file-card';

type FileWithPreview = File & { preview: string };

export default function UploadLocationAsset() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const onUpload = async (files: File[]) => {
    console.log(files);
  };
  return (
    <>
      {files?.length ? (
        <PhotoProvider>
          {files?.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              onDelete={() => {}}
              progress={true}
            />
          ))}
        </PhotoProvider>
      ) : null}
      <FileDropzone
        value={files}
        onValueChange={(files) => setFiles(files as FileWithPreview[])}
        onUpload={onUpload}
        multiple
        maxFiles={3}
        maxSize={8 * 1024 * 1024}
      />
    </>
  );
}
