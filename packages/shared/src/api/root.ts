import { authRouter } from './router/auth';
import { fileRouter } from './router/file';
import { locationRouter } from './router/location';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  location: locationRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
