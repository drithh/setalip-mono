import { FormState } from '@repo/shared/form';
import {
  InsertLoyaltyReward,
  InsertLoyaltyShop,
} from '@repo/shared/repository';
import { z, ZodType } from 'zod';

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

export const createLoyaltyRewardSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  credit: z.coerce.number(),
  is_active: z.coerce.number().refine((v) => v === 0 || v === 1),
}) satisfies ZodType<InsertLoyaltyReward>;

export type CreateLoyaltyRewardSchema = z.infer<
  typeof createLoyaltyRewardSchema
>;
export type FormCreateLoyaltyReward = FormState<CreateLoyaltyRewardSchema>;

export const editLoyaltyRewardSchema = createLoyaltyRewardSchema.extend({
  id: z.coerce.number(),
});

export type EditLoyaltyRewardSchema = z.infer<typeof editLoyaltyRewardSchema>;
export type FormEditLoyaltyReward = FormState<EditLoyaltyRewardSchema>;

export const createLoyaltyShopSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  price: z.coerce.number(),
  file: z.custom<File | null>(
    (data) => data === null || data instanceof File,
    'Data is not an instance of a File',
  ),
}) satisfies ZodType<InsertLoyaltyShop>;

export type CreateLoyaltyShopSchema = z.infer<typeof createLoyaltyShopSchema>;
export type FormCreateLoyaltyShop = FormState<CreateLoyaltyShopSchema>;

export const editLoyaltyShopSchema = createLoyaltyShopSchema.extend({
  id: z.coerce.number(),
  image_url: z.string().optional(),
});

export type EditLoyaltyShopSchema = z.infer<typeof editLoyaltyShopSchema>;
export type FormEditLoyaltyShop = FormState<EditLoyaltyShopSchema>;
