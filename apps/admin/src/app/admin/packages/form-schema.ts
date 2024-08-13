import { FormState } from '@repo/shared/form';
import { InsertPackage } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createPackageSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.coerce.number(),
  credit: z.coerce.number(),
  loyalty_points: z.coerce.number(),
  one_time_only: z.coerce.number().refine((v) => v === 0 || v === 1),
  is_active: z.coerce.number().refine((v) => v === 0 || v === 1),
  valid_for: z.coerce.number(),
  position: z.coerce.number(),
  class_type_id: z.coerce.number(),

  is_discount: z.coerce.number().refine((v) => v === 0 || v === 1),
  discount_end_date: z.coerce.date().optional(),
  discount_percentage: z.coerce.number().optional(),
}) satisfies ZodType<InsertPackage>;

export type CreatePackageSchema = z.infer<typeof createPackageSchema>;
export type FormCreatePackage = FormState<CreatePackageSchema>;

export const editPackageSchema = createPackageSchema.extend({
  id: z.coerce.number(),
});

export type EditPackageSchema = z.infer<typeof editPackageSchema>;
export type FormEditPackage = FormState<EditPackageSchema>;
