'server-only';

import { TYPES } from '#dep/inversify/types';
import { TRPCRouterRecord } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { UserRepository } from '#dep/repository/user';
import { LoyaltyService } from '#dep/service/loyalty';
import { AgendaService } from '#dep/service/agenda';
import { NotificationService, NotificationType } from '#dep/notification/index';
import { differenceInHours } from 'date-fns';
export const cronRouter = {
  cron: publicProcedure.query(async ({ ctx, input }) => {
    const loyaltyService = ctx.container.get<LoyaltyService>(
      TYPES.LoyaltyService
    );
    const userRepository = ctx.container.get<UserRepository>(
      TYPES.UserRepository
    );

    const users = await userRepository.findAllUserBirthday();

    for (const user of users) {
      await loyaltyService.createOnReward({
        user_id: user.id,
        note: 'From us for your birthday',
        reward_id: 4,
        reference_id: user.id,
      });
    }

    // notification agenda if less than 2 hours
    const agendaService = ctx.container.get<AgendaService>(TYPES.AgendaService);

    const schedules = await agendaService.findScheduleByDate({
      page: 1,
      perPage: 1000,
      date: new Date(),
    });

    const notifcationService = ctx.container.get<NotificationService>(
      TYPES.NotificationService
    );

    const scheduleResults = schedules.result?.data ?? [];

    for (const schedule of scheduleResults) {
      if (schedule.participant ?? 0 < 1) {
        continue;
      }

      const booking = await agendaService.findAgendaBookingById(schedule.id);

      if (!booking || !booking.result) {
        continue;
      }

      const user = await userRepository.findById(booking.result?.user_id);
      if (!user) {
        continue;
      }

      const now = new Date();
      const diff = differenceInHours(schedule.time, now);
      if (diff < 3) {
        await notifcationService.sendNotification({
          recipient: user.phone_number,
          payload: {
            type: NotificationType.UserBookingLessThan2Hours,
            class: schedule.class_name,
            date: schedule.time,
            facility: schedule.location_facility_name,
            location: schedule.location_name,
          },
        });
      }
    }
  }),
} satisfies TRPCRouterRecord;
