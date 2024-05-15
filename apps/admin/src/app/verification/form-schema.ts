import { z } from 'zod';

export const verifyOtpSchema = z.object({
  userId: z.coerce.number(),
  otp: z.string().length(6),
});
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  userId: z.coerce.number(),
});
export type ResendOtpSchema = z.infer<typeof resendOtpSchema>;
