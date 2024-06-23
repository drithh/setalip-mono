'server-only';

import { TYPES } from '#dep/inversify/types';
import { ClassTypeService } from '#dep/service/index';
import { TRPCRouterRecord } from '@trpc/server';
import { publicProcedure } from '../trpc';

export const classTypeRouter = {
  findAll: publicProcedure.query(async ({ ctx, input }) => {
    const classTypeService = ctx.container.get<ClassTypeService>(
      TYPES.ClassTypeService
    );

    const classTypes = await classTypeService.findAll();

    return classTypes;
  }),
} satisfies TRPCRouterRecord;
