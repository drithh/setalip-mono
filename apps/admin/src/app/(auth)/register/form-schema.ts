import { FormState } from '@repo/shared/form';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const registerUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    name: z.string(),
    phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
      message: 'Invalid phone number',
    }),
    address: z.string(),
    location_id: z.coerce.number().optional(),
    dateOfBirth: z.coerce.date(),
    referralId: z.coerce.number().optional(),
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

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type FormRegisterUser = FormState<RegisterUserSchema>;
