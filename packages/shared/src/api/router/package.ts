'server-only';

import { TYPES } from '#dep/inversify/types';
import { PackageService } from '#dep/service/package';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  deletePackageSchema,
  findAllPackageSchema,
  findAllPackageTransactionByUserIdSchema,
  findAllPackageTransactionSchema,
} from '../schema';
import { PackageTransactions } from '#dep/db/schema';

export const packageRouter = {
  findAll: adminProcedure
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
  findAllPackageTransaction: adminProcedure
    .input(findAllPackageTransactionSchema)
    .query(async ({ ctx, input }) => {
      const statuses = input.status
        ?.split('.')
        .map((status) => status as PackageTransactions['status']);

      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      const packages = await packageService.findAllPackageTransaction({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        status: statuses,
        user_name: input.name,
      });

      return packages;
    }),

  findAllPackageTransactionByUserId: protectedProcedure
    .input(findAllPackageTransactionByUserIdSchema)
    .query(async ({ ctx, input }) => {
      const user_id = ctx.session.userId;

      const statuses = input.status
        ?.split('.')
        .map((status) => status as PackageTransactions['status']);

      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      const packages = await packageService.findAllPackageTransactionByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        user_id: user_id,
        status: statuses,
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
