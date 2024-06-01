import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const createPackageSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.coerce.number(),
  credit: z.coerce.number(),
  loyalty_points: z.coerce.number(),
  one_time_only: z.coerce.number().refine((v) => v === 0 || v === 1),
  valid_for: z.coerce.number(),
  class_type_id: z.coerce.number(),
});

export type CreatePackageSchema = z.infer<typeof createPackageSchema>;
export type FormCreatePackage = FormState<CreatePackageSchema>;
