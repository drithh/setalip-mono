import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const editUserSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone_number: z.string().min(10).max(20),
  address: z.string().min(10).max(255),
  location_id: z.coerce.number(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
export type FormEditUser = FormState<EditUserSchema>;
