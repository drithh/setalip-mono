'server-only';

import { TYPES } from '#dep/inversify/types';
import { VoucherService } from '#dep/service/voucher';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import { deleteVoucherSchema, findAllVoucherSchema } from '../schema';
import { SelectVoucher } from '#dep/repository/voucher';

export const voucherRouter = {
  findAll: adminProcedure
    .input(findAllVoucherSchema)
    .query(async ({ ctx, input }) => {
      const types = input.types
        ?.split('.')
        .map((type) => type as SelectVoucher['type']);

      const voucherService = ctx.container.get<VoucherService>(
        TYPES.VoucherService
      );

      const vouchers = await voucherService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        name: input.name,
        code: input.code,
        types: types,
      });

      return vouchers;
    }),
  delete: protectedProcedure
    .input(deleteVoucherSchema)
    .mutation(async ({ ctx, input }) => {
      const voucherService = ctx.container.get<VoucherService>(
        TYPES.VoucherService
      );

      await voucherService.delete(input.id);
    }),
} satisfies TRPCRouterRecord;
