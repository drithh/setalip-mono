import { authRouter } from './router/auth';
import { fileRouter } from './router/file';
import { locationRouter } from './router/location';
import { packageRouter } from './router/package';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  location: locationRouter,
  file: fileRouter,
  package: packageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
