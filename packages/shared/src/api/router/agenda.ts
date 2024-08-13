import { TYPES } from '#dep/inversify/types';
import { AgendaService } from '#dep/service/agenda';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure, publicProcedure } from '../trpc';
import {
  deleteAgendaSchema,
  deleteParticipantSchema,
  findAllAgendaSchema,
  findAllCoachAgendaSchema,
  findAllScheduleSchema,
  findAllUserAgendaSchema,
  updateAgendaBookingSchema,
} from '../schema';
import { parse } from 'date-fns';
import { SelectAgendaBooking } from '#dep/repository/agenda';

export const agendaRouter = {
  findAll: protectedProcedure
    .input(findAllAgendaSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach_name?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location_name?.split('.').map((location) => parseInt(location)) ??
        [];

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const agendas = await agendaService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        className: input.class_name,
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
        input.coach_name?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location_name?.split('.').map((location) => parseInt(location)) ??
        [];

      const classTypes =
        input.class_type_name
          ?.split('.')
          .map((classType) => parseInt(classType)) ?? [];
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const classNames =
        input.class_name?.split('.').map((className) => parseInt(className)) ??
        [];

      const today = () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      };
      const convertDate = (date: string) =>
        parse(date, 'yyyy-MM-dd', new Date());

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
        classNames: classNames,
        date: getDate(input.date),
        is_show: true,
      });

      return schedules;
    }),
  findAllCoachAgenda: protectedProcedure
    .input(findAllCoachAgendaSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach_name?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location_name?.split('.').map((location) => parseInt(location)) ??
        [];

      const classTypes =
        input.class_type_name
          ?.split('.')
          .map((classType) => parseInt(classType)) ?? [];

      const user = ctx.session.user;

      if (!user) {
        return {
          result: undefined,
          error: new Error('User not found'),
        };
      }

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const agendas = await agendaService.findAllByCoachId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        locations: locations,
        classTypes: classTypes,
        coachUserId: user.id,
      });

      return agendas;
    }),

  findAllUserAgenda: protectedProcedure
    .input(findAllUserAgendaSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach_name?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location_name?.split('.').map((location) => parseInt(location)) ??
        [];

      const classTypes =
        input.class_type_name
          ?.split('.')
          .map((classType) => parseInt(classType)) ?? [];

      const user = ctx.session.user;

      if (!user) {
        return {
          result: undefined,
          error: new Error('User not found'),
        };
      }

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const agendas = await agendaService.findAgendaByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        locations: locations,
        coaches: coaches,
        classTypes: classTypes,
        userId: user.id,
      });

      return agendas;
    }),

  updateAgendaBooking: protectedProcedure
    .input(updateAgendaBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const status = input.status as SelectAgendaBooking['status'];

      const result = await agendaService.updateAgendaBookingById({
        id: input.id,
        status,
      });

      return result;
    }),
  delete: adminProcedure
    .input(deleteAgendaSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      console.log('input', input);

      const result = await agendaService.delete({
        id: input.id,
        is_refund: input.is_refund,
      });

      if (result.error) {
        throw result;
      }
      return result;
    }),
} satisfies TRPCRouterRecord;
