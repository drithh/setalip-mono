import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const schema = z.object({
  phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
    message: 'Invalid phone number',
  }),
  password: z.string(),
});
