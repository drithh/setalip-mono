import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllAgendaOptions,
  InsertAgenda,
  AgendaRepository,
  SelectAgenda,
  UpdateAgenda,
  InsertAgendaBooking,
  UpdateAgendaBooking,
  FindScheduleByDateOptions,
  FindAgendaByUserOptions,
  UserRepository,
  ClassRepository,
  PackageRepository,
  CreditRepository,
  InsertAgendaAndTransaction,
  LocationRepository,
  FindAllAgendaByCoachOptions,
  SelectCoach,
  UpdateAgendaBookingById,
  LoyaltyRepository,
  SelectAgendaBooking,
  DeleteAgenda,
  UpdateAgendaBookingParticipant,
  CancelAgenda,
  InsertAgendaBookingByAdmin,
  InsertAgendaBookingAndTransactionByAdmin,
  DeleteParticipant,
  SelectAgendaRecurrence,
  FindScheduleByIdOptions,
  UpdateAgendaRecurrence,
  InsertAgendaRecurrence,
  FindAllAgendaRecurrenceOption,
  SelectAllAgendaRecurrence,
  FindAllAgendaBookingByMonthAndLocation,
  SelectAgendaBookingWithIncome,
} from '../repository';
import { AgendaService } from './agenda';
import {
  addDays,
  addMinutes,
  differenceInHours,
  format,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';
import { NotificationType, type NotificationService } from '../notification';
import { PromiseResult } from '../types';

@injectable()
export class AgendaServiceImpl implements AgendaService {
  private _agendaRepository: AgendaRepository;
  private _userRepository: UserRepository;
  private _classRepository: ClassRepository;
  private _packageRepository: PackageRepository;
  private _creditRepository: CreditRepository;
  private _notificationService: NotificationService;
  private _locationRepository: LocationRepository;
  private _loyaltyRepository: LoyaltyRepository;

  constructor(
    @inject(TYPES.AgendaRepository) agendaRepository: AgendaRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.ClassRepository) classRepository: ClassRepository,
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository,
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.LocationRepository) locationRepository: LocationRepository,
    @inject(TYPES.LoyaltyRepository) loyaltyRepository: LoyaltyRepository
  ) {
    this._agendaRepository = agendaRepository;
    this._userRepository = userRepository;
    this._classRepository = classRepository;
    this._packageRepository = packageRepository;
    this._creditRepository = creditRepository;
    this._notificationService = notificationService;
    this._locationRepository = locationRepository;
    this._loyaltyRepository = loyaltyRepository;
  }

  async count() {
    return this._agendaRepository.count();
  }

  async countParticipant(id: SelectAgenda['id']) {
    return this._agendaRepository.countParticipant(id);
  }

  async countCheckedInByUserId(userId: SelectAgenda['id']) {
    return this._agendaRepository.countCheckedInByUserId(userId);
  }

  async countCoachAgenda(userId: SelectCoach['user_id']) {
    return this._agendaRepository.countCoachAgenda(userId);
  }

  async findAll(data: FindAllAgendaOptions) {
    const agendas = await this._agendaRepository.findAll(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async findAllAgendaRecurrence(
    data: FindAllAgendaRecurrenceOption
  ): PromiseResult<SelectAllAgendaRecurrence, Error> {
    const agendaRecurrence =
      await this._agendaRepository.findAllAgendaRecurrence(data);

    return {
      result: agendaRecurrence,
      error: undefined,
    };
  }

  async findById(id: SelectAgenda['id']) {
    const singleAgenda = await this._agendaRepository.findById(id);

    if (!singleAgenda) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    return {
      result: singleAgenda,
    };
  }

  async findAllAgendaBookingByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ) {
    const agendaBooking =
      await this._agendaRepository.findAllAgendaBookingByMonthAndLocation(data);

    return {
      result: agendaBooking,
      error: undefined,
    };
  }

  async findAllCoachAgendaByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ) {
    const agendaBooking =
      await this._agendaRepository.findAllCoachAgendaByMonthAndLocation(data);

    return {
      result: agendaBooking,
      error: undefined,
    };
  }

  async findAllAgendaBookingByAgendaId(id: SelectAgenda['id']) {
    const agendaBooking =
      await this._agendaRepository.findAllAgendaBookingByAgendaId(id);

    return {
      result: agendaBooking,
      error: undefined,
    };
  }

  async findAgendaRecurrenceById(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<SelectAgendaRecurrence, Error> {
    const agendaRecurrence =
      await this._agendaRepository.findAgendaRecurrenceById(id);

    if (!agendaRecurrence) {
      return {
        result: undefined,
        error: new Error('Agenda recurrence not found'),
      };
    }

    return {
      result: agendaRecurrence,
      error: undefined,
    };
  }

  async findAgendaBookingById(id: SelectAgendaBooking['id']) {
    const agendaBooking =
      await this._agendaRepository.findAgendaBookingById(id);

    if (!agendaBooking) {
      return {
        error: new Error('Agenda booking not found'),
      };
    }

    return {
      result: agendaBooking,
    };
  }

  async findAllParticipantByAgendaId(id: SelectAgenda['id']) {
    const participants =
      await this._agendaRepository.findAllParticipantByAgendaId(id);

    return {
      result: participants,
      error: undefined,
    };
  }

  async findTodayScheduleByCoachId(coachUserId: SelectCoach['user_id']) {
    const schedules =
      await this._agendaRepository.findTodayScheduleByCoachId(coachUserId);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findAllByCoachId(data: FindAllAgendaByCoachOptions) {
    const schedules = await this._agendaRepository.findAllByCoachId(data);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleByDate(data: FindScheduleByDateOptions) {
    const schedules = await this._agendaRepository.findScheduleByDate(data);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleById(data: FindScheduleByIdOptions) {
    const singleSchedule = await this._agendaRepository.findScheduleById(data);

    if (!singleSchedule) {
      return {
        error: new Error('Schedule not found'),
      };
    }

    return {
      result: singleSchedule,
    };
  }

  async findAgendaByUserId(data: FindAgendaByUserOptions) {
    const agendas = await this._agendaRepository.findAgendaByUserId(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async create(data: InsertAgenda) {
    const result = await this._agendaRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async createAgendaRecurrence(data: InsertAgendaRecurrence) {
    const result = await this._agendaRepository.createAgendaRecurrence(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async createAgendaBooking(data: InsertAgendaBooking) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    let agenda: SelectAgenda | undefined;
    if (data.agenda_id) {
      agenda = await this._agendaRepository.findById(data.agenda_id as number);
      if (!agenda) {
        return {
          error: new Error('Agenda not found'),
        };
      }
    } else {
      if (!data.agenda_recurrence_id) {
        return {
          error: new Error('Agenda recurrence not found'),
        };
      }

      const agendaRecurrence =
        await this._agendaRepository.findAgendaRecurrenceById(
          data.agenda_recurrence_id
        );

      if (agendaRecurrence === undefined) {
        console.error('Failed to get agenda recurrence', agendaRecurrence);
        return {
          error: new Error('Failed to get agenda recurrence'),
        };
      }

      const createAgenda = await this._agendaRepository.create({
        is_show: 1,
        class_id: agendaRecurrence.class_id,
        coach_id: agendaRecurrence.coach_id,
        location_facility_id: agendaRecurrence.location_facility_id,
        time: data.time,
        agenda_recurrence_id: agendaRecurrence.id,
      });

      if (createAgenda instanceof Error) {
        return {
          error: createAgenda,
        };
      }
      agenda = createAgenda;
    }

    const agendaClass = await this._classRepository.findById(agenda.class_id);

    if (!agendaClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.location_facility_id
      );

    if (!agendaLocation) {
      return {
        error: new Error('Location not found'),
      };
    }

    const countParticipant = await this._agendaRepository.countParticipant(
      agenda.id
    );

    if (countParticipant >= agendaClass.slot) {
      return {
        error: new Error('Class is full'),
      };
    }

    const expiringCredit =
      await this._packageRepository.findAboutToExpiredPackage(
        user.id,
        agendaClass.class_type_id
      );

    if (!expiringCredit) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    const credit = await this._creditRepository.findAmountByUserId(user.id);
    if (!credit) {
      return {
        error: new Error('User does not have any credit'),
      };
    }

    const currentCredit = credit.find(
      (item) => item.class_type_id === agendaClass.class_type_id
    );

    if (!currentCredit || currentCredit.remaining_amount < 1) {
      return {
        error: new Error('User does not have any credit for this class'),
      };
    }
    const userAgenda = await this._agendaRepository.findActiveAgendaByUserId(
      user.id
    );

    const creditTransaction = await this._creditRepository.findById(
      expiringCredit.id
    );

    if (!creditTransaction) {
      return {
        error: new Error('Credit transaction not found'),
      };
    }

    // iterate over userAgenda to check if user overlaps with existing agenda
    // const agendaEndTime = addMinutes(agenda.time, agendaClass.duration);

    for (const userAgendaItem of userAgenda) {
      const userAgendaEndTime = addMinutes(
        userAgendaItem.time ?? new Date(),
        userAgendaItem.class_duration ?? 0
      );

      if (
        (isBefore(userAgendaItem.time ?? new Date(), agenda.time) ||
          isEqual(userAgendaItem.time ?? new Date(), agenda.time)) &&
        (isAfter(userAgendaEndTime, agenda.time) ||
          isEqual(userAgendaEndTime, agenda.time))
      ) {
        return {
          error: new Error('User already has an agenda at this time'),
        };
      }
    }

    const inputData: InsertAgendaAndTransaction = {
      ...data,
      agenda_id: agenda.id,
      status: 'booked',
      credit_transaction_id: creditTransaction.id,
      class_type_id: agendaClass.class_type_id,
      type: 'credit',
      amount: 1,
      note: `Booked ${agendaClass.name} class on ${format(agenda.time, 'dd MMM yyyy - HH:mm')}`,
    };

    const result = await this._agendaRepository.createAgendaBooking(inputData);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserBookedAgenda,
        date: agenda.time,
        class: agendaClass.name,
        duration: agendaClass.duration,
        location: agendaLocation.name,
        facility: agendaLocation.facility_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
      };
    }

    return {
      result,
    };
  }

  async createAgendaBookingByAdmin(data: InsertAgendaBookingByAdmin) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('Participant not found'),
      };
    }

    const useUserCredit = await this._userRepository.findById(
      data.used_credit_user_id
    );

    if (!useUserCredit) {
      return {
        error: new Error('User not found'),
      };
    }
    let agenda: SelectAgenda | undefined;
    if (data.agenda_id) {
      agenda = await this._agendaRepository.findById(data.agenda_id as number);
      if (!agenda) {
        return {
          error: new Error('Agenda not found'),
        };
      }
    } else {
      if (!data.agenda_recurrence_id) {
        return {
          error: new Error('Agenda recurrence not found'),
        };
      }

      const agendaRecurrence =
        await this._agendaRepository.findAgendaRecurrenceById(
          data.agenda_recurrence_id
        );

      if (agendaRecurrence === undefined) {
        console.error('Failed to get agenda recurrence', agendaRecurrence);
        return {
          error: new Error('Failed to get agenda recurrence'),
        };
      }

      const createAgenda = await this._agendaRepository.create({
        is_show: 1,
        class_id: agendaRecurrence.class_id,
        coach_id: agendaRecurrence.coach_id,
        location_facility_id: agendaRecurrence.location_facility_id,
        time: data.time,
        agenda_recurrence_id: agendaRecurrence.id,
      });

      if (createAgenda instanceof Error) {
        return {
          error: createAgenda,
        };
      }
      agenda = createAgenda;
    }

    const agendaClass = await this._classRepository.findById(agenda.class_id);

    if (!agendaClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.location_facility_id
      );

    if (!agendaLocation) {
      return {
        error: new Error('Location not found'),
      };
    }

    const countParticipant = await this._agendaRepository.countParticipant(
      agenda.id
    );

    if (countParticipant >= agendaClass.slot) {
      return {
        error: new Error('Class is full'),
      };
    }

    const expiringCredit =
      await this._packageRepository.findAboutToExpiredPackage(
        useUserCredit.id,
        agendaClass.class_type_id
      );

    if (!expiringCredit) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    const credit = await this._creditRepository.findAmountByUserId(
      useUserCredit.id
    );
    if (!credit) {
      return {
        error: new Error('User does not have any credit'),
      };
    }

    const currentCredit = credit.find(
      (item) => item.class_type_id === agendaClass.class_type_id
    );

    if (!currentCredit || currentCredit.remaining_amount < 1) {
      return {
        error: new Error('User does not have any credit for this class'),
      };
    }

    const creditTransaction = await this._creditRepository.findById(
      expiringCredit.id
    );

    if (!creditTransaction) {
      return {
        error: new Error('Credit transaction not found'),
      };
    }

    const userAgenda = await this._agendaRepository.findActiveAgendaByUserId(
      user.id
    );

    for (const userAgendaItem of userAgenda) {
      const userAgendaEndTime = addMinutes(
        userAgendaItem.time ?? new Date(),
        userAgendaItem.class_duration ?? 0
      );

      if (
        (isBefore(userAgendaItem.time ?? new Date(), agenda.time) ||
          isEqual(userAgendaItem.time ?? new Date(), agenda.time)) &&
        (isAfter(userAgendaEndTime, agenda.time) ||
          isEqual(userAgendaEndTime, agenda.time))
      ) {
        return {
          error: new Error('User already has an agenda at this time'),
        };
      }
    }

    const inputData: InsertAgendaBookingAndTransactionByAdmin = {
      agenda_id: agenda.id,
      user_id: data.user_id,
      used_credit_user_id: data.used_credit_user_id,
      status: 'booked',
      credit_transaction_id: creditTransaction.id,
      class_type_id: agendaClass.class_type_id,
      type: 'credit',
      amount: 1,
      note: `Booked For ${user.name} in the ${agendaClass.name} class on ${format(agenda.time, 'dd MMM yyyy - HH:mm')}`,
    };

    const result =
      await this._agendaRepository.createAgendaBookingByAdmin(inputData);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserBookedAgenda,
        date: agenda.time,
        class: agendaClass.name,
        duration: agendaClass.duration,
        location: agendaLocation.name,
        facility: agendaLocation.facility_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateAgenda) {
    const result = await this._agendaRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaRecurrence(data: UpdateAgendaRecurrence) {
    const result = await this._agendaRepository.updateAgendaRecurrence(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaBooking(data: UpdateAgendaBooking) {
    const result = await this._agendaRepository.updateAgendaBooking(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaBookingParticipant(data: UpdateAgendaBookingParticipant) {
    const result =
      await this._agendaRepository.updateAgendaBookingParticipant(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaBookingById(data: UpdateAgendaBookingById) {
    const result = await this._agendaRepository.updateAgendaBookingById(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    // loyalty rewards
    if (data.status === 'checked_in') {
      // check if loyalty reward already exists

      const agendaBooking = await this._agendaRepository.findAgendaBookingById(
        data.id
      );

      if (!agendaBooking) {
        return {
          result: undefined,
          error: new Error('Agenda booking not found'),
        };
      }

      const loyaltyCheck =
        await this._loyaltyRepository.findByRewardIdAndReferenceId(
          1,
          agendaBooking.id
        );

      if (loyaltyCheck) {
        return {
          result: undefined,
          error: undefined,
        };
      }

      const agenda = await this._agendaRepository.findById(
        agendaBooking.agenda_id as number
      );

      if (!agenda) {
        return {
          result: undefined,
          error: new Error('Agenda not found'),
        };
      }

      const singleClass = await this._classRepository.findById(agenda.class_id);

      if (!singleClass) {
        return {
          result: undefined,
          error: new Error('Class not found'),
        };
      }

      const user = await this._userRepository.findById(agendaBooking.user_id);

      if (!user) {
        return {
          result: undefined,
          error: new Error('User not found'),
        };
      }

      const loyalty = await this._loyaltyRepository.createOnReward({
        reward_id: 1,
        user_id: user.id,
        note: `Checked in to ${singleClass.name} class on ${agenda.time}`,
        reference_id: agendaBooking.id,
      });

      if (loyalty instanceof Error) {
        return {
          result: undefined,
          error: new Error('Failed to create loyalty reward', loyalty),
        };
      }
    }

    return {
      result: result,
    };
  }

  async delete(data: DeleteAgenda) {
    if (data.id === undefined || data.id === null || data.id === 0) {
      const result = await this._agendaRepository.delete(data);

      if (result instanceof Error) {
        return {
          result: undefined,
          error: result,
        };
      }

      return {
        result: result,
      };
    }

    const agenda = await this._agendaRepository.findById(data.id);

    if (!agenda) {
      return {
        result: undefined,
        error: new Error('Agenda not found'),
      };
    }

    const agendaClass = await this._classRepository.findDeletedById(
      agenda.class_id
    );

    if (!agendaClass) {
      return {
        result: undefined,
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.location_facility_id
      );

    if (!agendaLocation) {
      return {
        result: undefined,
        error: new Error('Location not found'),
      };
    }
    const agendaBookings =
      await this._agendaRepository.findAllAgendaBookingByAgendaId(data.id);

    const result = await this._agendaRepository.delete(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    for (const booking of agendaBookings) {
      const user = await this._userRepository.findById(booking.user_id);

      if (!user) {
        return {
          result: undefined,
          error: new Error('User not found'),
        };
      }

      const notification = await this._notificationService.sendNotification({
        payload: {
          type: NotificationType.AdminDeletedAgenda,
          date: agenda.time,
          class: agendaClass.name,
          location: agendaLocation.name,
          is_refund: data.is_refund,
        },
        recipient: user.phone_number,
      });

      if (notification.error) {
        return {
          result: undefined,
          error: notification.error,
        };
      }
    }

    return {
      result: result,
    };
  }

  async deleteAgendaRecurrence(id: SelectAgendaRecurrence['id']) {
    const result = await this._agendaRepository.deleteAgendaRecurrence(id);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async deleteAgendaBooking(data: DeleteParticipant) {
    const agendaBooking = await this._agendaRepository.findAgendaBookingById(
      data.id
    );

    if (!agendaBooking) {
      return {
        result: undefined,
        error: new Error('Agenda booking not found'),
      };
    }

    const agenda = await this._agendaRepository.findById(
      agendaBooking.agenda_id as number
    );

    if (!agenda) {
      return {
        result: undefined,
        error: new Error('Agenda not found'),
      };
    }

    const agendaClass = await this._classRepository.findById(agenda.class_id);

    if (!agendaClass) {
      return {
        result: undefined,
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.location_facility_id
      );

    if (!agendaLocation) {
      return {
        result: undefined,
        error: new Error('Location not found'),
      };
    }

    const user = await this._userRepository.findById(agendaBooking.user_id);

    if (!user) {
      return {
        result: undefined,
        error: new Error('User not found'),
      };
    }
    data;
    const result = await this._agendaRepository.deleteAgendaBooking(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.AdminCancelledUserAgenda,
        date: agenda.time,
        class: agendaClass.name,
        location: agendaLocation.name,
        facility: agendaLocation.facility_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        result: undefined,
        error: notification.error,
      };
    }

    return {
      result: result,
    };
  }

  async cancel(data: CancelAgenda) {
    // get agneda
    const agendaBooking = await this._agendaRepository.findAgendaBookingById(
      data.agenda_booking_id
    );

    if (!agendaBooking) {
      return {
        result: undefined,
        error: new Error('Agenda booking not found'),
      };
    }

    const agenda = await this._agendaRepository.findById(
      agendaBooking.agenda_id as number
    );

    if (!agenda) {
      return {
        result: undefined,
        error: new Error('Agenda not found'),
      };
    }

    // if agenda < 24 hours, cannot cancel
    const agendaTime = agenda.time;
    const now = new Date();

    const hoursDifference = differenceInHours(agendaTime, now);

    if (hoursDifference < 24 && isBefore(now, agendaTime)) {
      return {
        result: undefined,
        error: new Error('The agenda is less than 24 hours away'),
      };
    }

    const result = await this._agendaRepository.cancel(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }
}
