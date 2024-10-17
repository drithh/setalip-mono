import { TYPES } from '#dep/inversify/types';
import { AgendaService } from '#dep/service/agenda';
import { TRPCRouterRecord } from '@trpc/server';
import { adminProcedure, protectedProcedure, publicProcedure } from '../trpc';
import {
  cancelAgendaSchema,
  deleteAgendaBookingSchema,
  deleteAgendaRecurrenceSchema,
  deleteAgendaSchema,
  deleteParticipantSchema,
  findAllAgendaBookingByMonthAndLocationSchema,
  findAllAgendaRecurrenceSchema,
  findAllAgendaSchema,
  findAllCoachAgendaSchema,
  findAllScheduleSchema,
  findAllUserAgendaSchema,
  findAllUserAgendaSchema__Admin,
  insertAgendaBookingAdminSchema,
  updateAgendaBookingSchema,
} from '../schema';
import { parse, startOfToday } from 'date-fns';
import { SelectAgendaBooking } from '#dep/repository/agenda';
import { ClassTypeService } from '#dep/service/class-type';

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

      const convertDate = (date: string) =>
        parse(date, 'yyyy-MM-dd', new Date());

      const getDate = (date?: string) => {
        return date ? convertDate(date) : startOfToday();
      };

      const agendas = await agendaService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        className: input.class_name,
        locations: locations,
        coaches: coaches,
        date: getDate(input.date),
      });

      return agendas;
    }),
  findAllAgendaRecurrence: adminProcedure
    .input(findAllAgendaRecurrenceSchema)
    .query(async ({ ctx, input }) => {
      const coaches =
        input.coach_name?.split('.').map((coach) => parseInt(coach)) ?? [];

      const locations =
        input.location_name?.split('.').map((location) => parseInt(location)) ??
        [];

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const agendas = await agendaService.findAllAgendaRecurrence({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        locations: locations,
        coaches: coaches,
        day_of_week: input.day_of_week ?? 0,
      });

      return agendas;
    }),
  findAllAgendaBookingByMonthAndLocation: adminProcedure
    .input(findAllAgendaBookingByMonthAndLocationSchema)
    .query(async ({ ctx, input }) => {
      const classTypeService = ctx.container.get<ClassTypeService>(
        TYPES.ClassTypeService
      );
      const result =
        await classTypeService.findAllIncomeByMonthAndLocation(input);
      return result;
    }),
  findAllCoachAgendaByMonthAndLocation: adminProcedure
    .input(findAllAgendaBookingByMonthAndLocationSchema)
    .query(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );
      const result =
        await agendaService.findAllCoachAgendaByMonthAndLocation(input);
      return result;
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

      const convertDate = (date: string) =>
        parse(date, 'yyyy-MM-dd', new Date());

      const getDate = (date?: string) => {
        return date ? convertDate(date) : startOfToday();
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

      const agendas = await agendaService.findAllByUserId({
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

  findAllUserAgenda__Admin: adminProcedure
    .input(findAllUserAgendaSchema__Admin)
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

      const agendas = await agendaService.findAllByUserId({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        locations: locations,
        coaches: coaches,
        classTypes: classTypes,
        userId: input.user_id,
      });

      return agendas;
    }),

  createAgendaBookingAdmin: adminProcedure
    .input(insertAgendaBookingAdminSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.agenda_id === undefined && input.agenda_recurrence_id === 0) {
        throw new Error('Agenda id is required');
      }

      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const result = await agendaService.createAgendaBookingByAdmin({
        agenda_id: input.agenda_id,
        used_credit_user_id: input.used_credit_user_id,
        user_id: input.user_id,
        time: input.time,
        agenda_recurrence_id: input.agenda_recurrence_id,
      });

      if (result.error) {
        throw result.error;
      }
      return result;
    }),

  updateAgendaBookingById: protectedProcedure
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
  cancel: protectedProcedure
    .input(cancelAgendaSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const result = await agendaService.cancelAgendaBookingByUser({
        id: input.id,
        user_id: ctx.session.userId,
      });

      if (result.error) {
        throw result.error;
      }
      return result;
    }),
  deleteAgendaBooking: adminProcedure
    .input(deleteAgendaBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const result = await agendaService.cancelAgendaBookingByAdmin({
        id: input.id,
        type: input.type,
      });

      if (result.error) {
        throw result.error;
      }
      return result;
    }),
  delete: adminProcedure
    .input(deleteAgendaSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const result = await agendaService.delete({
        id: input.id,
        time: input.time,
        class_id: input.class_id,
        coach_id: input.coach_id,
        location_facility_id: input.location_facility_id,
        agenda_recurrence_id: input.agenda_recurrence_id,
        is_refund: input.is_refund,
      });

      if (result.error) {
        throw result.error;
      }
      return result;
    }),

  deleteAgendaRecurrence: adminProcedure
    .input(deleteAgendaRecurrenceSchema)
    .mutation(async ({ ctx, input }) => {
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );

      const result = await agendaService.deleteAgendaRecurrence(input.id);

      if (result.error) {
        throw result.error;
      }
      return result;
    }),
} satisfies TRPCRouterRecord;
