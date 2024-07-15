import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const createTransactionSchema = z.object({
  id: z.coerce.number().optional(),
  unique_code: z.coerce.number(),
  voucher_code: z.string().optional(),
  package_id: z.coerce.number(),
  deposit_account_id: z.coerce.number(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type FormCreateTransaction = FormState<CreateTransactionSchema>;
