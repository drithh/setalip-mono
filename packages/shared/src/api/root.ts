import { authRouter } from './router/auth';
import { postRouter } from './router/post';
import { createTRPCRouter, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
  // hello world
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
