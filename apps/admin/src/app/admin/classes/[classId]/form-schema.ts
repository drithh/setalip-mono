import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createClassSchema } from '../form-schema';

export const editDetailClassSchema = createClassSchema.extend({
  class_id: z.coerce.number(),
  class_locations: z.coerce.string().optional(),
});

export type EditDetailClassSchema = z.infer<typeof editDetailClassSchema>;
export type FormEditDetailClass = FormState<EditDetailClassSchema>;

export const uploadClassAssetSchema = z.object({
  classId: z.coerce.number(),
  files: z.custom<File[] | File>((data) => {
    if (!Array.isArray(data)) {
      return data instanceof File;
    }
    for (const file of data) {
      if (!(file instanceof File)) {
        return false;
      }
    }
    return true;
  }, 'Data is not an instance of a File'),
});

export type UploadClassAssetSchema = z.infer<typeof uploadClassAssetSchema>;
export type FormUploadClassAsset = FormState<UploadClassAssetSchema>;
