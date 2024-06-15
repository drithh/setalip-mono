import { TYPES } from '#dep/inversify/types';
import { AgendaService } from '#dep/service/agenda';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import {
  deleteParticipantSchema,
  findAllAgendaSchema,
  findAllScheduleSchema,
} from '../schema';

export const agendaRouter = {
  findAll: protectedProcedure
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
  findAllSchedule: publicProcedure
    .input(findAllScheduleSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location?.split('.').map((location) => parseInt(location)) ?? [];

      const classTypes =
        input.classType?.split('.').map((classType) => parseInt(classType)) ??
        [];
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const today = () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      };

      const convertDate = (date: string) => {
        // from 2022-02-02 to 2022-02-02T00:00:00.000Z
        return new Date(`${date}T00:00:00.000Z`);
      };

      const getDate = (date?: string) => {
        return date ? convertDate(date) : today();
      };

      const schedules = await agendaService.findScheduleByDate({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        coaches: coaches,
        locations: locations,
        classTypes: classTypes,
        date: getDate(input.date),
      });

      return schedules;
    }),
} satisfies TRPCRouterRecord;
