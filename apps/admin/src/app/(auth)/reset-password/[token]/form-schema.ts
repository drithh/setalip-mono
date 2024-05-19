import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      message: 'Passwords must match',
      path: ['passwordConfirmation'],
    },
  );

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type FormResetPassword = FormState<ResetPasswordSchema>;
