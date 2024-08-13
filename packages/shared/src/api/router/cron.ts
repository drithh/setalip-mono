'server-only';

import { TYPES } from '#dep/inversify/types';
import { TRPCRouterRecord } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { UserRepository } from '#dep/repository/user';
import { LoyaltyService } from '#dep/service/loyalty';
import { AgendaService } from '#dep/service/agenda';
import { NotificationService, NotificationType } from '#dep/notification/index';
import { differenceInHours } from 'date-fns';
import { cronSchema } from '../schema';
import { env } from '#dep/env';
import { container } from '#dep/inversify/container';
import { PackageService } from '#dep/service/package';

export const cronRouter = {
  cron: publicProcedure.input(cronSchema).mutation(async ({ ctx, input }) => {
    if (input.secret !== env.CRON_SECRET) {
      return {
        result: undefined,
        error: new Error('Invalid secret'),
      };
    }
    let cronRun = [];

    const currentDate = new Date();

    const packageService = container.get<PackageService>(TYPES.PackageService);

    const result = await packageService.deleteExpiredPackageTransaction();
    if (result.error) {
      cronRun.push('Job: Delete expired package transaction failed to run');
    } else {
      cronRun.push('Job: Delete expired package transaction successfully run');
    }

    const agendaService = ctx.container.get<AgendaService>(TYPES.AgendaService);

    const createRecurrence = await agendaService.createTodayRecurrence(
      currentDate.getDay()
    );

    if (createRecurrence.error) {
      cronRun.push('Job: Create today recurrence failed to run');
    } else {
      cronRun.push('Job: Create today recurrence successfully run');
    }

    if (currentDate.getHours() % 3 === 0) {
      const loyaltyService = ctx.container.get<LoyaltyService>(
        TYPES.LoyaltyService
      );

      const userRepository = ctx.container.get<UserRepository>(
        TYPES.UserRepository
      );
      // for every 9am
      if (currentDate.getHours() === 9) {
        const users = await userRepository.findAllUserBirthday();

        for (const user of users) {
          const result = await loyaltyService.createOnReward({
            user_id: user.id,
            note: 'From us for your birthday',
            reward_id: 4,
            reference_id: user.id,
          });

          if (result.error) {
            cronRun.push(`Job: Birthday reward failed to run for ${user.name}`);
          }
        }

        cronRun.push('Job: Birthday reward successfully run');
      }

      if (currentDate.getHours() === 6) {
        // delete package transaction if expired
      }

      // notification agenda if less than 3 hours
      const agendaService = ctx.container.get<AgendaService>(
        TYPES.AgendaService
      );
      const schedules = await agendaService.findScheduleByDate({
        page: 1,
        perPage: 1000,
        date: currentDate,
      });

      const notifcationService = ctx.container.get<NotificationService>(
        TYPES.NotificationService
      );

      const scheduleResults = schedules.result?.data ?? [];
      for (const schedule of scheduleResults) {
        if ((schedule.participant ?? 0) < 1) {
          continue;
        }
        const agendaBookings =
          await agendaService.findAllAgendaBookingByAgendaId(schedule.id);
        if (
          agendaBookings?.result === undefined ||
          agendaBookings.result.length < 1
        ) {
          continue;
        }

        for (const booking of agendaBookings.result) {
          const user = await userRepository.findById(booking.user_id);
          if (!user) {
            cronRun.push(
              `Job: Notification agenda if less than 3 hours failed to run for user_id ${booking.user_id}`
            );
            continue;
          }

          const diff = differenceInHours(schedule.time, currentDate);
          if (diff < 3) {
            const result = await notifcationService.sendNotification({
              recipient: user.phone_number,
              payload: {
                type: NotificationType.UserBookingLessThan2Hours,
                class: schedule.class_name,
                date: schedule.time,
                facility: schedule.location_facility_name,
                location: schedule.location_name,
              },
            });

            if (result.error) {
              cronRun.push(
                `Job: Notification agenda if less than 3 hours failed to run for ${user.name}`
              );
            }
          }
        }
      }

      cronRun.push(
        'Job: Notification agenda if less than 3 hours successfully run'
      );
    }

    return {
      result: cronRun.length > 0 ? cronRun.join('\n') : 'No job run',
      error: undefined,
    };
  }),
} satisfies TRPCRouterRecord;
