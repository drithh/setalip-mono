import { FormState } from '@repo/shared/form';
import { InsertReview } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number(),
  review: z.string().min(3).max(255),
  user_id: z.coerce.number(),
  is_show: z.coerce.number().refine((v) => v === 0 || v === 1),
}) satisfies ZodType<InsertReview>;

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type FormCreateReview = FormState<CreateReviewSchema>;

export const editReviewSchema = createReviewSchema.extend({
  id: z.coerce.number(),
});

export type EditReviewSchema = z.infer<typeof editReviewSchema>;
export type FormEditReview = FormState<EditReviewSchema>;
