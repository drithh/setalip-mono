import { TYPES } from '#dep/inversify/types';
import { AgendaService } from '#dep/service/agenda';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { deleteParticipantSchema, findAllAgendaSchema } from '../schema';

export const agendaRouter = {
  findAll: publicProcedure
    .input(findAllAgendaSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location?.split('.').map((location) => parseInt(location)) ?? [];

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const agendas = await agendaService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        className: input.className,
        locations: locations,
        coaches: coaches,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
      });

      return agendas;
    }),
} satisfies TRPCRouterRecord;
