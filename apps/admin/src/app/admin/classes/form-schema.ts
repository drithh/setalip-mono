import { FormState } from '@repo/shared/form';
import { InsertClass } from '@repo/shared/repository';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z, ZodType } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(3).max(255),
  class_type_id: z.coerce.number(),
  description: z.string().min(3).max(255),
  duration: z.coerce.number(),
  slot: z.coerce.number(),
}) satisfies ZodType<InsertClass>;

export type CreateClassSchema = z.infer<typeof createClassSchema>;
export type FormCreateClass = FormState<CreateClassSchema>;
