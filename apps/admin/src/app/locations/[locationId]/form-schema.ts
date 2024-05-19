import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const editFacilitySchema = z.object({
  name: z.string().min(3).max(255),
  capacity: z.coerce.number(),
  level: z.coerce.number(),
});

export type EditFacilitySchema = z.infer<typeof editFacilitySchema>;
export type FormEditFacility = FormState<EditFacilitySchema>;
