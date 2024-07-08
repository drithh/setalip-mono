import { FormState } from '@repo/shared/form';
import { InsertLoyalty } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createLoyaltySchema = z.object({
  amount: z.coerce.number(),
  note: z.string().min(3).max(255),
  user_id: z.coerce.number(),
});

export type CreateLoyaltySchema = z.infer<typeof createLoyaltySchema>;
export type FormCreateLoyalty = FormState<CreateLoyaltySchema>;

export const deleteLoyaltySchema = createLoyaltySchema.extend({});

export type DeleteLoyaltySchema = z.infer<typeof deleteLoyaltySchema>;
export type FormDeleteLoyalty = FormState<DeleteLoyaltySchema>;
