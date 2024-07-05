import { FormState } from '@repo/shared/form';
import { InsertPackage } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const editPackageTransactionSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
  status: z.string(),
});

export type EditPackageTransactionSchema = z.infer<
  typeof editPackageTransactionSchema
>;
export type FormEditPackageTransaction =
  FormState<EditPackageTransactionSchema>;
