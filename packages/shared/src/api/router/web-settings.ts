'server-only';

import { TYPES } from '#dep/inversify/types';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  deleteDepositAccountSchema,
  deleteFrequentlyAskedQuestionSchema,
  deleteReviewSchema,
  findAllFrequentlyAskedQuestionSchema,
} from '../schema';
import { WebSettings } from '#dep/db/schema';
import { WebSettingService } from '#dep/service/web-setting';

export const webSettingRouter = {
  findAllFrequentlyAskedQuestion: adminProcedure
    .input(findAllFrequentlyAskedQuestionSchema)
    .query(async ({ ctx }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      return webSettingService.findAllFrequentlyAskedQuestion({
        pag
      }
    }),

  deleteDepositAccount: adminProcedure
    .input(deleteDepositAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      await webSettingService.deleteDepositAccount(input.id);
    }),

  deleteReview: adminProcedure
    .input(deleteReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      await webSettingService.deleteReview(input.id);
    }),

  deleteFrequentlyAskedQuestion: adminProcedure
    .input(deleteFrequentlyAskedQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      await webSettingService.deleteFrequentlyAskedQuestion(input.id);
    }),
} satisfies TRPCRouterRecord;
