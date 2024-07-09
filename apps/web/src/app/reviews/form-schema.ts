import { FormState } from '@repo/shared/form';
import { InsertPackage, InsertReview } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(10),
  review: z.string().min(3).max(255),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type FormCreateReview = FormState<CreateReviewSchema>;
