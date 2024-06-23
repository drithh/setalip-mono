'server-only';

import { TYPES } from '#dep/inversify/types';
import { LoyaltyService } from '#dep/service/loyalty';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { findAllUserLoyaltySchema } from '../schema';
import { SelectLoyalty } from '#dep/repository/loyalty';

export const loyaltyRouter = {
  findAllByUserId: protectedProcedure
    .input(findAllUserLoyaltySchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.userId;

      const types = input.type
        ?.split('.')
        .map((type) => type as SelectLoyalty['type']);

      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      const loyaltys = await loyaltyService.findAllByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        types: types,
        user_id: userId,
      });

      return loyaltys;
    }),
} satisfies TRPCRouterRecord;
