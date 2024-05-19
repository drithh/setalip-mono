import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const verifyOtpSchema = z.object({
  userId: z.coerce.number(),
  otp: z.string().length(6),
});
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type FormVerifyOtp = FormState<VerifyOtpSchema>;

export const resendOtpSchema = z.object({
  userId: z.coerce.number(),
});
export type ResendOtpSchema = z.infer<typeof resendOtpSchema>;
export type FormResendOtp = FormState<ResendOtpSchema>;
