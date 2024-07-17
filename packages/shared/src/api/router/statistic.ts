'server-only';

import { TYPES } from '#dep/inversify/types';
import { StatisticService } from '#dep/service/statistic';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import { deleteStatisticSchema, findAllStatisticSchema } from '../schema';

export const statisticRouter = {
  findAll: adminProcedure
    .input(findAllStatisticSchema)
    .query(async ({ ctx, input }) => {
      const roles = input.role
        ?.split('.')
        .map((type) => type as 'coach' | 'user');

      const statisticService = ctx.container.get<StatisticService>(
        TYPES.StatisticService
      );

      const statistics = await statisticService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,

        role: roles,
      });

      return statistics;
    }),

  delete: adminProcedure
    .input(deleteStatisticSchema)
    .mutation(async ({ ctx, input }) => {
      const statisticService = ctx.container.get<StatisticService>(
        TYPES.StatisticService
      );

      await statisticService.delete(input.id);
    }),
} satisfies TRPCRouterRecord;
