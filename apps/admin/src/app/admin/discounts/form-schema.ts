import { FormState } from '@repo/shared/form';
import { InsertPackage, InsertVoucher } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

// code: string;
// type: 'fixed' | 'percentage';
// discount: number;
// expired_at: Date;
export const createVoucherSchema = z.object({
  code: z.string(),
  type: z.enum(['fixed', 'percentage']),
  discount: z.number().positive(),
  expired_at: z.date(),
  user_id: z.number().optional(),
}) satisfies ZodType<InsertVoucher>;

export type CreateVoucherSchema = z.infer<typeof createVoucherSchema>;
export type FormCreateVoucher = FormState<CreateVoucherSchema>;

export const editVoucherSchema = createVoucherSchema.extend({
  id: z.coerce.number(),
});

export type EditVoucherSchema = z.infer<typeof editVoucherSchema>;
export type FormEditVoucher = FormState<EditVoucherSchema>;
