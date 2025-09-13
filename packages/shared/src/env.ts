import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
console.log(process.env);
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.string().default('development'),
    WHAPIFY_ACCOUNT: z.string(),
    WHAPIFY_SECRET: z.string(),
    ADMIN_URL: z.string().default('http://localhost:3000'),
    WEB_URL: z.string().default('http://localhost:3001'),
    CRON_SECRET: z.string(),

    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET: z.string(),

    CLOUDFLARE_ACCOUNT_ID: z.string(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'PUBLIC_',

  client: {},

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    WHAPIFY_ACCOUNT: process.env.WHAPIFY_ACCOUNT,
    WHAPIFY_SECRET: process.env.WHAPIFY_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    ADMIN_URL: process.env.ADMIN_URL,
    WEB_URL: process.env.WEB_URL,

    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
