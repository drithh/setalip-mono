'server-only';

import { TYPES } from '#dep/inversify/types';
import { CreditService } from '#dep/service/credit';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  findAllUserCreditSchema,
  findAllUserCreditSchema__Admin,
} from '../schema';
import { SelectCredit } from '#dep/repository/credit';
import { lucia } from '#dep/auth/index';

export const creditRouter = {
  findAllByUserId: protectedProcedure
    .input(findAllUserCreditSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.userId;

      // const types = input.type
      //   ?.split('.')
      // .map((type) => type as SelectCredit['type']);

      const creditService = ctx.container.get<CreditService>(
        TYPES.CreditService
      );

      const credits = await creditService.findAllByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        user_id: userId,
      });

      return credits;
    }),
  findAllByUserId__Admin: adminProcedure
    .input(findAllUserCreditSchema__Admin)
    .query(async ({ ctx, input }) => {
      // const userId = ctx.session.userId;

      // const types = input.type
      //   ?.split('.')
      // .map((type) => type as SelectCredit['type']);

      const creditService = ctx.container.get<CreditService>(
        TYPES.CreditService
      );

      const credits = await creditService.findAllByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        user_id: input.user_id,
      });

      return credits;
    }),
} satisfies TRPCRouterRecord;
