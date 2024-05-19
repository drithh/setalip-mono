import { FormState } from '@repo/shared/form';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
    message: 'Invalid phone number',
  }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type FormForgotPassword = FormState<ForgotPasswordSchema>;
