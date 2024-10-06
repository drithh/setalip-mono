'server-only';

import { TYPES } from '#dep/inversify/types';
import { ReportFormService } from '#dep/service/index';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, publicProcedure } from '../trpc';

export const reportFormRouter = {
  findAll: adminProcedure.query(async ({ ctx }) => {
    const reportFormService = ctx.container.get<ReportFormService>(
      TYPES.ReportFormService
    );

    const reportForms = await reportFormService.findAll();

    return reportForms;
  }),
} satisfies TRPCRouterRecord;
