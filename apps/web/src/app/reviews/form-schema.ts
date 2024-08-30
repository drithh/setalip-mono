import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(10),
  review: z.string().min(40, 'Review minimal 40 karakter').max(255),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type FormCreateReview = FormState<CreateReviewSchema>;
