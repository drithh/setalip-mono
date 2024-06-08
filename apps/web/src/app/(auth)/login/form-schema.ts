import { FormState } from '@repo/shared/form';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const loginUserSchema = z.object({
  phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
    message: 'Invalid phone number',
  }),
  password: z.string(),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
export type FormLoginUser = FormState<LoginUserSchema>;
