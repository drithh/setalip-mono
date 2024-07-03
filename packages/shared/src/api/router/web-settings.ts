'server-only';

import { TYPES } from '#dep/inversify/types';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  deleteDepositAccountSchema,
  deleteFrequentlyAskedQuestionSchema,
  deleteReviewSchema,
  findAllDepositAccountSchema,
  findAllFrequentlyAskedQuestionSchema,
  findAllReviewSchema,
} from '../schema';
import { WebSettings } from '#dep/db/schema';
import { WebSettingService } from '#dep/service/web-setting';

export const webSettingRouter = {
  findAllFrequentlyAskedQuestion: adminProcedure
    .input(findAllFrequentlyAskedQuestionSchema)
    .query(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      const faqs = webSettingService.findAllFrequentlyAskedQuestion({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        question: input.question,
      });

      return faqs;
    }),

  findAllReview: adminProcedure
    .input(findAllReviewSchema)
    .query(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      const reviews = webSettingService.findAllReview({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        email: input.email,
      });

      return reviews;
    }),

  findAllDepositAccount: adminProcedure
    .input(findAllDepositAccountSchema)
    .query(async ({ ctx, input }) => {
      const webSettingService = ctx.container.get<WebSettingService>(
        TYPES.WebSettingService
      );

      const depositAccounts = webSettingService.findAllDepositAccount({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        name: input.name,
      });

      return depositAccounts;
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
