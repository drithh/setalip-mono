import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.selectFrom('users').selectAll().execute();
  }),
} satisfies TRPCRouterRecord;
