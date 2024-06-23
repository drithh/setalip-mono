'server-only';

import { TYPES } from '#dep/inversify/types';
import { PackageService } from '#dep/service/package';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { findAllUserCreditSchema } from '../schema';
import { CreditService } from '#dep/service/index';
import { SelectCredit } from '#dep/repository/credit';

export const packageRouter = {
  findAllByUserId: protectedProcedure
    .input(findAllUserCreditSchema)
    .query(async ({ ctx, input }) => {
      const types = input.credit_type
        ?.split('.')
        .map((type) => type as SelectCredit['type']);

      const creditService = ctx.container.get<CreditService>(
        TYPES.CreditService
      );

      const packages = await creditService.findAllByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        types: types,
      });

      return packages;
    }),
} satisfies TRPCRouterRecord;
