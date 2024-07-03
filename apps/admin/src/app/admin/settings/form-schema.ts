import { FormState } from '@repo/shared/form';
import {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestion,
  InsertReview,
  UpdateWebSetting,
} from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const editWebSettingSchema = z.object({
  id: z.coerce.number(),
  key: z.string().min(3).max(255),
  value: z.string().min(3).max(255),
}) satisfies ZodType<UpdateWebSetting>;

export const createDepositAccountSchema = z.object({
  account_number: z.string().min(3).max(255),
  bank_name: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
}) satisfies ZodType<InsertDepositAccount>;

export type CreateDepositAccountSchema = z.infer<
  typeof createDepositAccountSchema
>;
export type FormCreateDepositAccount = FormState<CreateDepositAccountSchema>;

export const editDepositAccountSchema = createDepositAccountSchema.extend({
  id: z.coerce.number(),
});

export type EditDepositAccountSchema = z.infer<typeof editDepositAccountSchema>;
export type FormEditDepositAccount = FormState<EditDepositAccountSchema>;

export const createReviewSchema = z.object({
  rating: z.coerce.number(),
  review: z.string().min(3).max(255),
  user_id: z.coerce.number(),
}) satisfies ZodType<InsertReview>;

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type FormCreateReview = FormState<CreateReviewSchema>;

export const editReviewSchema = createReviewSchema.extend({
  id: z.coerce.number(),
});

export type EditReviewSchema = z.infer<typeof editReviewSchema>;
export type FormEditReview = FormState<EditReviewSchema>;

export const createFrequentlyAskedQuestionSchema = z.object({
  answer: z.string().min(3).max(255),
  question: z.string().min(3).max(255),
}) satisfies ZodType<InsertFrequentlyAskedQuestion>;

export type CreateFrequentlyAskedQuestionSchema = z.infer<
  typeof createFrequentlyAskedQuestionSchema
>;
export type FormCreateFrequentlyAskedQuestion =
  FormState<CreateFrequentlyAskedQuestionSchema>;

export const editFrequentlyAskedQuestionSchema =
  createFrequentlyAskedQuestionSchema.extend({
    id: z.coerce.number(),
  });

export type EditFrequentlyAskedQuestionSchema = z.infer<
  typeof editFrequentlyAskedQuestionSchema
>;
export type FormEditFrequentlyAskedQuestion =
  FormState<EditFrequentlyAskedQuestionSchema>;
