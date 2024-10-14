import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import {
  AgendaService,
  DefaultReturn,
  FindAgendaByUserOptions,
  FindAllAgendaByCoachOptions,
  FindAllAgendaOptions,
  FindScheduleByDateOptions,
  FindScheduleByIdOptions,
  SelectAgenda__Coach__Class__Location,
  SelectAgenda__Coach__Class__Location__AgendaBooking,
  SelectAgenda__Coach__Class__Location__Participant,
} from './agenda';
import {
  addDays,
  addMinutes,
  differenceInHours,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
} from 'date-fns';
import { NotificationType, type NotificationService } from '../notification';
import { PromiseResult } from '../types';
import { Expression, SqlBool, expressionBuilder, sql } from 'kysely';
import { db, DB } from '../db';
import type {
  AgendaRepository,
  UserRepository,
  ClassRepository,
  PackageRepository,
  CreditRepository,
  LocationRepository,
  LoyaltyRepository,
  SelectAgenda,
  SelectCoach,
  SelectAgendaRecurrence,
  SelectAgendaBooking,
  InsertAgenda,
  InsertAgendaRecurrence,
  InsertAgendaBooking,
  UpdateAgenda,
  UpdateAgendaRecurrence,
  UpdateAgendaBooking,
} from '../repository';

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

  // async countParticipant(id: SelectAgenda['id']) {
  //   return this._agendaRepository.countParticipant(id);
  // }

  // async countCheckedInByUserId(userId: SelectAgenda['id']) {
  //   return this._agendaRepository.countCheckedInByUserId(userId);
  // }

  // async countCoachAgenda(userId: SelectCoach['user_id']) {
  //   return this._agendaRepository.countCoachAgenda(userId);
  // }

  async findAll(data: FindAllAgendaOptions) {
    const {
      page = 1,
      perPage = 10,
      sort,
      className,
      coaches,
      locations,
      date,
    } = data;
    const localDate = format(date, 'yyyy-MM-dd');
    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agendas.time', 'asc']
    ).join(' ') as `${keyof SelectAgenda} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      'agendas' | 'classes' | 'coaches' | 'locations'
    >();

    if (className) {
      customFilters.push(eb('classes.name', 'like', `%${className}%`));
    }

    if (coaches?.length && coaches.length > 0) {
      customFilters.push(eb('coaches.id', 'in', coaches));
    }

    if (locations?.length && locations.length > 0) {
      customFilters.push(eb('locations.id', 'in', locations));
    }

    const agendas = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      customFilters,

      withCoach: true,
      withClass: true,
      withLocation: true,
      withParticipant: true,
    });

    return {
      result: agendas,
      error: undefined,
    };
  }

  async findAllByCoachId(data: FindAllAgendaByCoachOptions) {
    const {
      page = 1,
      perPage = 10,
      sort,
      classTypes,
      locations,
      date,
      coachUserId,
    } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agendas.time', 'desc']
    ).join(' ') as `${keyof SelectAgenda} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      | 'agendas'
      | 'classes'
      | 'class_types'
      | 'coaches'
      | 'locations'
      | 'agenda_bookings'
    >();

    customFilters.push(eb('coaches.user_id', '=', coachUserId));
    customFilters.push(eb('agendas.deleted_at', 'is', null));

    if (classTypes?.length && classTypes.length > 0) {
      customFilters.push(eb('class_types.id', 'in', classTypes));
    }
    if (locations?.length && locations.length > 0) {
      customFilters.push(eb('locations.id', 'in', locations));
    }
    if (date) {
      const today = startOfDay(new Date(date));
      const tomorrow = endOfDay(today);
      customFilters.push(eb('agendas.time', '>=', today));
      customFilters.push(eb('agendas.time', '<', tomorrow));
    }

    const schedules = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      customFilters,
      withCoach: true,
      withClass: true,
      withLocation: true,
      withCountParticipant: true,
    });

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findAllByUserId(data: FindAgendaByUserOptions) {
    const {
      page = 1,
      userId,
      perPage = 10,
      sort,
      classTypes,
      coaches,
      locations,
    } = data;

    const offset = (page - 1) * perPage;

    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agenda_bookings.updated_at', 'desc']
    ).join(' ') as `${keyof SelectAgenda} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      | 'agendas'
      | 'classes'
      | 'class_types'
      | 'coaches'
      | 'locations'
      | 'agenda_bookings'
    >();

    customFilters.push(eb('agenda_bookings.user_id', '=', userId));
    customFilters.push(eb('agendas.deleted_at', 'is', null));

    if (classTypes?.length && classTypes.length > 0) {
      customFilters.push(eb('class_types.id', 'in', classTypes));
    }

    if (coaches?.length && coaches.length > 0) {
      customFilters.push(eb('coaches.id', 'in', coaches));
    }

    if (locations?.length && locations.length > 0) {
      customFilters.push(eb('locations.id', 'in', locations));
    }

    const agendas = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      customFilters,
      withCoach: true,
      withClass: true,
      withLocation: true,
      withAgendaBooking: true,
    });

    return {
      result: agendas,
      error: undefined,
    };
  }

  async findById(id: SelectAgenda['id']) {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'agendas'>();

    customFilters.push(eb('agendas.id', '=', id));
    customFilters.push(eb('agendas.deleted_at', 'is', null));

    const singleAgenda = (
      await this._agendaRepository.find({
        customFilters,
      })
    )?.[0];

    if (!singleAgenda) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    return {
      result: singleAgenda,
    };
  }

  async findAllParticipantByAgendaId(id: SelectAgenda['id']) {
    const participants = (
      await this._agendaRepository.find({
        filters: { id },
        withParticipant: true,
      })
    )?.[0];

    if (!participants) {
      return {
        error: new Error('Participants not found'),
      };
    }

    return {
      result: participants,
      error: undefined,
    };
  }

  async findScheduleByDate(data: FindScheduleByDateOptions) {
    const {
      page = 1,
      perPage = 10,
      sort,
      classTypes,
      coaches,
      locations,
      classNames,
      date,
    } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agendas.time', 'desc']
    ).join(' ') as `${keyof SelectAgenda} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      | 'agendas'
      | 'classes'
      | 'class_types'
      | 'coaches'
      | 'locations'
      | 'agenda_bookings'
    >();

    if (classTypes?.length && classTypes.length > 0) {
      customFilters.push(eb('class_types.id', 'in', classTypes));
    }
    if (coaches?.length && coaches.length > 0) {
      customFilters.push(eb('coaches.id', 'in', coaches));
    }
    if (locations?.length && locations.length > 0) {
      customFilters.push(eb('locations.id', 'in', locations));
    }
    if (classNames?.length && classNames.length > 0) {
      customFilters.push(eb('classes.id', 'in', classNames));
    }

    const schedules = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      date,
      withBackfillAgenda: true,
      withCoach: true,
      withClass: true,
      withLocation: true,
      withCountParticipant: true,
    });

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findTodayScheduleByCoachId(coachUserId: SelectCoach['user_id']) {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'agendas' | 'coaches'>();

    customFilters.push(eb('coaches.user_id', '=', coachUserId));
    customFilters.push(
      eb(sql`DATE(agendas.time)`, '=', format(new Date(), 'yyyy-MM-dd'))
    );
    customFilters.push(eb('agendas.deleted_at', 'is', null));

    const schedules = await this._agendaRepository.find({
      withCoach: true,
      withClass: true,
      withLocation: true,
      withCountParticipant: true,
    });

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleById(data: FindScheduleByIdOptions) {
    //   return schedule;
    const singleSchedule = (
      await this._agendaRepository.find({
        date: data.time,
        withBackfillAgenda: true,
        withClass: true,
        withLocation: true,
        withCoach: true,
        withCountParticipant: true,
      })
    )?.[0];

    if (!singleSchedule) {
      return {
        error: new Error('Schedule not found'),
      };
    }

    return {
      result: singleSchedule,
    };
  }

  //asdsadas

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

    const expiringCredit = await this._packageRepository.findAboutToExpired(
      user.id,
      agendaClass.class_type_id
    );

    if (!expiringCredit) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    // const credit = await this._creditRepository.findAmountByUserId(user.id);
    // if (!credit) {
    //   return {
    //     error: new Error('User does not have any credit'),
    //   };
    // }

    // const currentCredit = credit.find(
    //   (item) => item.class_type_id === agendaClass.class_type_id
    // );

    // if (!currentCredit || currentCredit.remaining_amount < 1) {
    //   return {
    //     error: new Error('User does not have any credit for this class'),
    //   };
    // }

    // const creditTransaction = await this._creditRepository.findById(
    //   expiringCredit.id
    // );

    // if (!creditTransaction) {
    //   return {
    //     error: new Error('Credit transaction not found'),
    //   };
    // }
    const userAgenda = await this._agendaRepository.findActiveAgendaByUserId(
      user.id
    );
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
      user_package_id: expiringCredit.id,
      class_type_id: agendaClass.class_type_id,
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

    const expiringCredit = await this._packageRepository.findAboutToExpired(
      useUserCredit.id,
      agendaClass.class_type_id
    );

    if (!expiringCredit) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    // const credit = await this._creditRepository.findAmountByUserId(
    //   useUserCredit.id
    // );
    // if (!credit) {
    //   return {
    //     error: new Error('User does not have any credit'),
    //   };
    // }

    // const currentCredit = credit.find(
    //   (item) => item.class_type_id === agendaClass.class_type_id
    // );

    // if (!currentCredit || currentCredit.remaining_amount < 1) {
    //   return {
    //     error: new Error('User does not have any credit for this class'),
    //   };
    // }

    // const creditTransaction = await this._creditRepository.findById(
    //   expiringCredit.id
    // );

    // if (!creditTransaction) {
    //   return {
    //     error: new Error('Credit transaction not found'),
    //   };
    // }

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
      user_package_id: expiringCredit.id,
      class_type_id: agendaClass.class_type_id,
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
