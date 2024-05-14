import { z } from 'zod';

export const schema = z.object({
  phoneNumber: z.string(),
  password: z.string(),
});
