import { agendaRouter } from './router/agenda';
import { authRouter } from './router/auth';
import { creditRouter } from './router/credit';
import { fileRouter } from './router/file';
import { locationRouter } from './router/location';
import { loyaltyRouter } from './router/loyalty';
import { packageRouter } from './router/package';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  location: locationRouter,
  file: fileRouter,
  package: packageRouter,
  user: userRouter,
  agenda: agendaRouter,
  credit: creditRouter,
  loyalty: loyaltyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
