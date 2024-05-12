import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});
