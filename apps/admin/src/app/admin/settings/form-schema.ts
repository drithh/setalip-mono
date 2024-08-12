import { FormState } from '@repo/shared/form';
import {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestion,
} from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const editWebSettingSchema = z.object({
  instagram_handle: z.string().min(3).max(255),
  tiktok_handle: z.string().min(3).max(255),
  logo: z.custom<File | null>(
    (data) => data === null || data instanceof File,
    'Data is not an instance of a File',
  ),
  terms_and_conditions: z.string().min(3),
  privacy_policy: z.string().min(3),
  url: z.string().url().optional(),
  // .refine((data) => {
  //   return data === undefined || data?.startsWith('http');
  // }),
});

export type EditWebSettingSchema = z.infer<typeof editWebSettingSchema>;
export type FormEditWebSetting = FormState<EditWebSettingSchema>;

export const createCarouselSchema = z.object({
  file: z.custom<File | null>(
    (data) => data === null || data instanceof File,
    'Data is not an instance of a File',
  ),
  title: z.string().min(3).max(255),
  image_url: z.string().url().optional(),
});

export type CreateCarouselSchema = z.infer<typeof createCarouselSchema>;
export type FormCreateCarousel = FormState<CreateCarouselSchema>;

export const editCarouselSchema = createCarouselSchema.extend({
  id: z.coerce.number(),
});

export type EditCarouselSchema = z.infer<typeof editCarouselSchema>;
export type FormEditCarousel = FormState<EditCarouselSchema>;

export const createDepositAccountSchema = z.object({
  name: z.string().min(3).max(255),
  bank_name: z.string().min(3).max(255),
  account_number: z.coerce.string(),
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
