'server-only';

import { TYPES } from '#dep/inversify/types';
import { LoyaltyService } from '#dep/service/loyalty';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import { findAllLoyaltySchema, findAllUserLoyaltySchema } from '../schema';
import { SelectLoyalty } from '#dep/repository/loyalty';

export const loyaltyRouter = {
  findAll: adminProcedure
    .input(findAllLoyaltySchema)
    .query(async ({ ctx, input }) => {
      const types = input.type
        ?.split('.')
        .map((type) => type as SelectLoyalty['type']);

      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      const loyaltys = await loyaltyService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        types: types,
        user_name: input.user_name,
      });

      return loyaltys;
    }),

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
