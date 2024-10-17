'server-only';

import { TYPES } from '#dep/inversify/types';
import { LoyaltyService } from '#dep/service/loyalty';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  deleteLoyaltyRewardSchema,
  deleteLoyaltyShopSchema,
  findAllLoyaltyRewardSchema,
  findAllLoyaltySchema,
  findAllLoyaltyShopSchema,
  findAllUserLoyaltySchema,
  findAllUserLoyaltySchema__Admin,
} from '../schema';
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

  findAllReward: protectedProcedure
    .input(findAllLoyaltyRewardSchema)
    .query(async ({ ctx, input }) => {
      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      const loyaltys = await loyaltyService.findAllReward({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
      });

      return loyaltys;
    }),

  findAllShop: protectedProcedure
    .input(findAllLoyaltyShopSchema)
    .query(async ({ ctx, input }) => {
      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      const loyaltys = await loyaltyService.findAllShop({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
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

  findAllByUserId__Admin: adminProcedure
    .input(findAllUserLoyaltySchema__Admin)
    .query(async ({ ctx, input }) => {
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
        user_id: input.user_id,
      });

      return loyaltys;
    }),
  deleteReward: adminProcedure
    .input(deleteLoyaltyRewardSchema)
    .mutation(async ({ ctx, input }) => {
      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      await loyaltyService.deleteReward(input.id);
    }),
  deleteShop: adminProcedure
    .input(deleteLoyaltyShopSchema)
    .mutation(async ({ ctx, input }) => {
      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      await loyaltyService.deleteShop(input.id);
    }),
} satisfies TRPCRouterRecord;
