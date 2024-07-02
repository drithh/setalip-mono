import { FormState } from '@repo/shared/form';
import { SelectUser } from '@repo/shared/repository';
import { z } from 'zod';

export const editUserSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone_number: z.string().min(10).max(20),
  address: z.string().min(10).max(255),
  role: z.enum(['admin', 'coach', 'owner', 'user']),
  location_id: z.coerce.number(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
export type FormEditUser = FormState<EditUserSchema>;

export const roles = [
  'admin',
  'user',
  'coach',
  'owner',
] satisfies SelectUser['role'][];

export const createCreditSchema = z.object({
  amount: z.coerce.number(),
  note: z.string().min(3).max(255),
  user_id: z.coerce.number(),
  class_type_id: z.coerce.number(),
  expired_at: z.coerce.date(),
});

export type CreateCreditSchema = z.infer<typeof createCreditSchema>;
export type FormCreateCredit = FormState<CreateCreditSchema>;

export const deleteCreditSchema = z.object({
  amount: z.coerce.number(),
  note: z.string().min(3).max(255),
  user_id: z.coerce.number(),
  class_type_id: z.coerce.number(),
});

export type DeleteCreditSchema = z.infer<typeof deleteCreditSchema>;
export type FormDeleteCredit = FormState<DeleteCreditSchema>;
