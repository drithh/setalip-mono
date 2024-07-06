import { FormState } from '@repo/shared/form';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
    message: 'Invalid phone number',
  }),
  email: z.string().email(),
  linkMaps: z.string().url(),
});

export type CreateLocationSchema = z.infer<typeof createLocationSchema>;
export type FormCreateLocation = FormState<CreateLocationSchema>;
