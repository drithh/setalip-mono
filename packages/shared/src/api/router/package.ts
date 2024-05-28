import { TYPES } from '#dep/inversify/types';
import { PackageService } from '#dep/service/package';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';

export const packageRouter = {
  findAll: protectedProcedure.query(async ({ ctx, input }) => {
    const packageService = ctx.container.get<PackageService>(
      TYPES.PackageService
    );

    const packages = await packageService.findAll();

    return packages;
  }),
} satisfies TRPCRouterRecord;
