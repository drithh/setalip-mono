'server-only';

import type { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, publicProcedure } from '../trpc';
import { TYPES } from '#dep/inversify/types';
import { ClassService } from '#dep/service/index';
import { z } from 'zod';
import { deleteClassSchema, deleteClassAssetSchema } from '../schema';

export const classRouter = {
  delete: adminProcedure
    .input(deleteClassSchema)
    .mutation(async ({ ctx, input }) => {
      const classService = ctx.container.get<ClassService>(TYPES.ClassService);

      const deleteClass = await classService.delete(input.id);

      return deleteClass;
    }),

  deleteAsset: adminProcedure
    .input(deleteClassAssetSchema)
    .mutation(async ({ ctx, input }) => {
      const classService = ctx.container.get<ClassService>(TYPES.ClassService);

      const deleteClassAsset = await classService.deleteAsset(input.id);

      return deleteClassAsset;
    }),
} satisfies TRPCRouterRecord;
