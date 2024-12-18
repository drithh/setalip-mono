'server-only';

import { TYPES } from '#dep/inversify/types';
import { PackageService } from '#dep/service/package';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure } from '../trpc';
import {
  deletePackageSchema,
  deleteUserPackageSchema,
  findAllPackageSchema,
  findAllPackageTransactionByUserIdSchema,
  findAllPackageTransactionByUserIdSchema__Admin,
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
        user_name: input.user_name,
      });

      return packages;
    }),

  findAllPackageTransactionByUserId: protectedProcedure
    .input(findAllPackageTransactionByUserIdSchema)
    .query(async ({ ctx, input }) => {
      const user_id = ctx.session.userId;

      const status = input.status as PackageTransactions['status'] | 'expired';

      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      const packages = await packageService.findAllPackageTransactionByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        user_id: user_id,
        status: status,
      });

      return packages;
    }),
  findAllPackageTransactionByUserId__Admin: adminProcedure
    .input(findAllPackageTransactionByUserIdSchema__Admin)
    .query(async ({ ctx, input }) => {
      const status = input.status as PackageTransactions['status'] | 'expired';

      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      const packages = await packageService.findAllPackageTransactionByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        user_id: input.user_id,
        status: status,
      });

      return packages;
    }),
  delete: adminProcedure
    .input(deletePackageSchema)
    .mutation(async ({ ctx, input }) => {
      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      await packageService.delete(input.packageId);
    }),
  deleteUserPackage: adminProcedure
    .input(deleteUserPackageSchema)
    .mutation(async ({ ctx, input }) => {
      const packageService = ctx.container.get<PackageService>(
        TYPES.PackageService
      );

      await packageService.deleteUserPackage(input.userPackageId);
    }),
} satisfies TRPCRouterRecord;
