import { FormState } from '@repo/shared/form';
import { InsertStatistic } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createSchema = z.object({
  name: z.string().min(3).max(255),
  point: z.coerce.number(),
  role: z.enum(['coach', 'user']),
}) satisfies ZodType<InsertStatistic>;

export type CreateSchema = z.infer<typeof createSchema>;
export type FormCreate = FormState<CreateSchema>;

export const editSchema = createSchema.extend({
  id: z.coerce.number(),
});

export type EditSchema = z.infer<typeof editSchema>;
export type FormEdit = FormState<EditSchema>;
