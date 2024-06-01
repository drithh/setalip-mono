import { TYPES } from '#dep/inversify/types';
import { PackageService } from '#dep/service/package';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { deletePackageSchema, findAllPackageSchema } from '../schema';

export const packageRouter = {
  findAll: publicProcedure
    .input(findAllPackageSchema)
    .query(async ({ ctx, input }) => {
      const types = input.class_type_id
        ?.split('.')
        .map((type) => parseInt(type));

      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      const packages = await packageService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        name: input.name,
        types: types,
      });

      return packages;
    }),
  delete: protectedProcedure
    .input(deletePackageSchema)
    .mutation(async ({ ctx, input }) => {
      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      await packageService.delete(input.packageId);
    }),
} satisfies TRPCRouterRecord;
