import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const editPackageTransactionSchema = z.object({
  id: z.coerce.number(),
  file: z.custom<File | null>((data) => {
    return data === null || data instanceof File;
  }, 'Data is not an instance of a File'),
  image_url: z.string().url().optional(),
});

export type EditPackageTransactionSchema = z.infer<
  typeof editPackageTransactionSchema
>;
export type FormEditPackageTransaction =
  FormState<EditPackageTransactionSchema>;

export const editUserPackageSchema = z.object({
  id: z.coerce.number(),
  expired_at: z.coerce.date(),
  credit: z.coerce.number(),
  credit_used: z.coerce.number(),
});

export type EditUserPackageSchema = z.infer<typeof editUserPackageSchema>;
export type FormEditUserPackage = FormState<EditUserPackageSchema>;
