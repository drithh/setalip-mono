import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import {
  AgendaService,
  DefaultReturn,
  FindAgendaByUserOptions,
  FindAllAgendaByCoachOptions,
  FindAllAgendaOptions,
  FindAllAgendaRecurrenceOption,
  FindScheduleByDateOptions,
  FindScheduleByIdOptions,
  InsertAgendaBookingOption,
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
  getDay,
  isAfter,
  isBefore,
  isEqual,
  set,
  startOfDay,
  subDays,
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
  BackFillProps,
  InsertAgendaCommand,
} from '../repository';
import type {
  DeleteAgenda,
  CancelAgendaBookingByAdminOption,
  CancelAgendaBookingByUserOption,
  InsertAgendaBookingByAdminOption,
  PackageService,
  SelectCoachAgendaBooking,
  FindAllAgendaBookingByMonthAndLocation,
} from '.';

@injectable()
export class AgendaServiceImpl implements AgendaService {
  private _agendaRepository: AgendaRepository;
  private _userRepository: UserRepository;
  private _classRepository: ClassRepository;
  private _packageRepository: PackageRepository;
  private _packageService: PackageService;
  private _creditRepository: CreditRepository;
  private _notificationService: NotificationService;
  private _locationRepository: LocationRepository;
  private _loyaltyRepository: LoyaltyRepository;

  constructor(
    @inject(TYPES.AgendaRepository) agendaRepository: AgendaRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.ClassRepository) classRepository: ClassRepository,
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository,
    @inject(TYPES.PackageService) packageService: PackageService,
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.LocationRepository) locationRepository: LocationRepository,
    @inject(TYPES.LoyaltyRepository) loyaltyRepository: LoyaltyRepository
  ) {
    this._agendaRepository = agendaRepository;
    this._userRepository = userRepository;
    this._classRepository = classRepository;
    this._packageRepository = packageRepository;
    this._packageService = packageService;
    this._creditRepository = creditRepository;
    this._notificationService = notificationService;
    this._locationRepository = locationRepository;
    this._loyaltyRepository = loyaltyRepository;
  }

  async count() {
    return this._agendaRepository.count();
  }

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
      'agendas' | 'classes' | 'coaches' | 'locations' | 'agenda_recurrences'
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

    const backfillProps: BackFillProps = {
      date,
      agendaFilter: [eb(sql`DATE(agendas.time)`, '=', localDate)],
      agendaReccurenceFilter: [
        eb(
          'agenda_recurrences.day_of_week',
          '=',
          sql<number>`DAYOFWEEK(${localDate}) - 1`
        ),
        eb('agenda_recurrences.start_date', '<=', date),
        eb('agenda_recurrences.end_date', '>=', date),
      ],
      unionFilter: [eb('deleted_at', 'is', null)],
    };

    const agendas = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      customFilters,

      backfillProps,
      withBackfillAgenda: true,

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
      | 'agenda_recurrences'
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

    const localDate = format(date, 'yyyy-MM-dd');

    const backfillProps: BackFillProps = {
      date,
      agendaFilter: [eb(sql`DATE(agendas.time)`, '=', localDate)],
      agendaReccurenceFilter: [
        eb(
          'agenda_recurrences.day_of_week',
          '=',
          sql<number>`DAYOFWEEK(${localDate}) - 1`
        ),
        eb('agenda_recurrences.start_date', '<=', date),
        eb('agenda_recurrences.end_date', '>=', date),
      ],
      unionFilter: [eb('deleted_at', 'is', null)],
    };

    const schedules = await this._agendaRepository.findWithPagination({
      offset,
      perPage,
      orderBy,
      withBackfillAgenda: true,
      backfillProps,
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
    const eb = expressionBuilder<
      DB,
      | 'agendas'
      | 'classes'
      | 'class_types'
      | 'coaches'
      | 'locations'
      | 'agenda_bookings'
      | 'agenda_recurrences'
    >();
    const date = data.time ?? new Date();

    const backfillProps: BackFillProps = {
      date,
      agendaFilter: [eb(sql`DATE(agendas.id)`, '=', data.id ?? 0)],
      agendaReccurenceFilter: [
        eb('agenda_recurrences.id', '=', data.agendaRecurrenceId ?? 0),
        eb('agenda_recurrences.start_date', '<=', date),
        eb('agenda_recurrences.end_date', '>=', date),
      ],
      unionFilter: [eb('deleted_at', 'is', null), eb('is_show', '=', 1)],
    };

    const singleSchedule = (
      await this._agendaRepository.find({
        backfillProps,
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

  async findAllAgendaBookingByAgendaId(agenda_id: SelectAgenda['id']) {
    const agendaBooking = await this._agendaRepository.findAgendaBooking({
      filters: { agenda_id },
    });

    if (!agendaBooking) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    return {
      result: agendaBooking,
    };
  }

  async findAgendaBookingById(id: SelectAgendaBooking['id']) {
    const agendaBooking = (
      await this._agendaRepository.findAgendaBooking({
        filters: { id },
      })
    )?.[0];

    if (!agendaBooking) {
      return {
        error: new Error('Agenda booking not found'),
      };
    }

    return {
      result: agendaBooking,
    };
  }

  async findAllAgendaRecurrence(data: FindAllAgendaRecurrenceOption) {
    const {
      page = 1,
      perPage = 10,
      sort,
      day_of_week,
      coaches,
      locations,
    } = data;
    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agenda_recurrences.time', 'asc']
    ).join(' ') as `${keyof SelectAgendaRecurrence} ${'asc' | 'desc'}`;

    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      'agenda_recurrences' | 'coaches' | 'locations'
    >();

    customFilters.push(eb('agenda_recurrences.day_of_week', '=', day_of_week));
    if (coaches?.length && coaches.length > 0) {
      customFilters.push(eb('coaches.id', 'in', coaches));
    }
    if (locations?.length && locations.length > 0) {
      customFilters.push(eb('locations.id', 'in', locations));
    }

    const agendaReccurences =
      await this._agendaRepository.findAgendaRecurrenceWithPagination({
        perPage,
        offset,
        orderBy,

        customFilters,
        withCoach: true,
        withClass: true,
        withLocation: true,
      });

    return {
      result: agendaReccurences,
      error: undefined,
    };
  }

  async findAgendaRecurrenceById(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<SelectAgendaRecurrence, Error> {
    const agendaRecurrence = (
      await this._agendaRepository.findAgendaRecurrence({
        filters: { id },
      })
    )?.[0];

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

  private async checkCoachAgendaAvailability(
    coachId: SelectCoach['id'],
    startTime: string,
    endTime: string
  ) {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'agendas' | 'classes'>();

    customFilters.push(eb('agendas.coach_id', '=', coachId));
    customFilters.push(eb('agendas.deleted_at', 'is', null));
    customFilters.push(eb(sql`agendas.time`, '<', endTime));
    customFilters.push(
      eb(
        sql`ADDDATE(agendas.time, INTERVAL classes.duration MINUTE)`,
        '>',
        startTime
      )
    );

    const coachAgenda = await this._agendaRepository.find({
      customFilters,
      withClass: true,
      withCoach: true,
    });

    if (coachAgenda.length > 0) {
      console.error('Coach is not available', coachAgenda);
      return new Error(
        `Coach is not available, ${coachAgenda[0]?.coach_name} at ${format(coachAgenda[0]?.time ?? new Date(), 'HH:mm')}`
      );
    }

    return undefined;
  }

  private async checkCoachAgendaRecurrenceAvailability(
    coachId: SelectCoach['id'],
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    startDate: string,
    endDate: string
  ) {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<DB, 'agenda_recurrences' | 'classes'>();

    customFilters.push(eb('agenda_recurrences.coach_id', '=', coachId));
    customFilters.push(eb('agenda_recurrences.day_of_week', '=', dayOfWeek));
    customFilters.push(eb('agenda_recurrences.time', '<', endTime));
    customFilters.push(
      eb(
        sql`ADDDATE(agenda_recurrences.time, INTERVAL classes.duration MINUTE)`,
        '>',
        startTime
      )
    );
    customFilters.push(eb(sql`agenda_recurrences.start_date`, '<=', startDate));
    customFilters.push(eb(sql`agenda_recurrences.end_date`, '>=', endDate));

    const coachAgenda = await this._agendaRepository.find({
      customFilters,
      withClass: true,
      withCoach: true,
    });

    if (coachAgenda.length > 0) {
      console.error('Coach is not available', coachAgenda);
      return new Error(
        `Coach is not available, ${coachAgenda[0]?.coach_name} at ${format(coachAgenda[0]?.time ?? new Date(), 'HH:mm')}`
      );
    }

    return undefined;
  }

  async create({ data, trx }: InsertAgendaCommand) {
    const singleClass = await this._classRepository.findById(data.class_id);

    if (singleClass?.duration === undefined) {
      console.error('Failed to get class duration', singleClass);
      return {
        error: new Error('Failed to get class duration'),
      };
    }
    const startTime = format(data.time, 'yyyy-MM-dd HH:mm:ss');
    const endTime = format(
      addMinutes(data.time, singleClass.duration),
      'yyyy-MM-dd HH:mm:ss'
    );

    const dayOfWeek = getDay(data.time);

    const coachAgendaAvailability = await this.checkCoachAgendaAvailability(
      data.coach_id,
      startTime,
      endTime
    );

    if (coachAgendaAvailability !== undefined) {
      return {
        error: coachAgendaAvailability,
      };
    }

    const coachAgendaRecurrenceAvailability =
      await this.checkCoachAgendaRecurrenceAvailability(
        data.coach_id,
        dayOfWeek,
        startTime,
        endTime,
        format(data.time, 'yyyy-MM-dd'),
        format(data.time, 'yyyy-MM-dd')
      );

    if (
      coachAgendaRecurrenceAvailability !== undefined &&
      data.agenda_recurrence_id === null
    ) {
      return {
        error: coachAgendaRecurrenceAvailability,
      };
    }

    const result = await this._agendaRepository.create({
      data,
    });

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result: result,
      error: undefined,
    };
  }

  async createAgendaRecurrence(data: InsertAgendaRecurrence) {
    const singleClass = await this._classRepository.findById(data.class_id);

    if (singleClass?.duration === undefined) {
      console.error('Failed to get class duration', singleClass);
      return {
        error: new Error('Failed to get class duration'),
      };
    }
    const startTime = format(data.time, 'yyyy-MM-dd HH:mm:ss');
    const endTime = format(
      addMinutes(data.time, singleClass.duration),
      'yyyy-MM-dd HH:mm:ss'
    );

    const dayOfWeek = getDay(data.time);

    const coachAgendaAvailability = await this.checkCoachAgendaAvailability(
      data.coach_id,
      startTime,
      endTime
    );

    if (coachAgendaAvailability !== undefined) {
      return {
        error: coachAgendaAvailability,
      };
    }

    const coachAgendaRecurrenceAvailability =
      await this.checkCoachAgendaRecurrenceAvailability(
        data.coach_id,
        dayOfWeek,
        startTime,
        endTime,
        format(data.time, 'yyyy-MM-dd'),
        format(data.time, 'yyyy-MM-dd')
      );

    if (coachAgendaRecurrenceAvailability !== undefined) {
      return {
        error: coachAgendaRecurrenceAvailability,
      };
    }

    const result = await this._agendaRepository.createAgendaRecurrence({
      data,
    });

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  private async findOrCreateAgendaFromRecurrence(
    time: Date,
    agendaId?: SelectAgenda['id'],
    agendaRecurrenceId?: SelectAgendaRecurrence['id']
  ): Promise<Error | SelectAgenda> {
    if (agendaId) {
      const agenda = (
        await this._agendaRepository.find({
          filters: { id: agendaId },
        })
      )?.[0];
      if (!agenda) {
        return new Error('Agenda not found');
      }

      return agenda;
    } else {
      if (!agendaRecurrenceId) {
        return new Error('Agenda recurrence not found');
      }

      const agendaRecurrence = (
        await this._agendaRepository.findAgendaRecurrence({
          filters: { id: agendaRecurrenceId },
        })
      )?.[0];

      if (agendaRecurrence === undefined) {
        console.error('Failed to get agenda recurrence', agendaRecurrence);
        return new Error('Failed to get agenda recurrence');
      }

      function combineDateAndTime(date: Date, time: string): Date {
        const [hours, minutes, seconds] = time.split(':').map(Number);

        return set(date, {
          hours: hours || 0,
          minutes: minutes || 0,
          seconds: seconds || 0,
          milliseconds: 0, // Reset milliseconds since MySQL TIME doesn't include them
        });
      }

      const agendaTime = combineDateAndTime(time, agendaRecurrence.time);

      const createAgenda = await this._agendaRepository.create({
        data: {
          is_show: 1,
          class_id: agendaRecurrence.class_id,
          coach_id: agendaRecurrence.coach_id,
          location_facility_id: agendaRecurrence.location_facility_id,
          time: agendaTime,
          agenda_recurrence_id: agendaRecurrence.id,
        },
      });

      if (createAgenda instanceof Error) {
        return createAgenda;
      }

      return createAgenda;
    }
  }

  private async checkAgendaConflict(
    userId: SelectAgendaBooking['user_id'],
    startTIme: Date,
    endTime: Date
  ): Promise<undefined | Error> {
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      | 'agendas'
      | 'classes'
      | 'class_types'
      | 'coaches'
      | 'locations'
      | 'agenda_bookings'
      | 'agenda_recurrences'
    >();
    customFilters.push(eb('agenda_bookings.user_id', '=', userId));
    customFilters.push(eb('agendas.deleted_at', 'is', null));
    // customFilters.push(eb('agendas.is_show', '=', 1));
    customFilters.push(eb('agendas.time', '<', endTime));
    customFilters.push(
      eb(
        sql`ADDDATE(agendas.time, INTERVAL classes.duration MINUTE)`,
        '>',
        startTIme
      )
    );

    const agendas = await this._agendaRepository.find({
      customFilters,
      withCoach: true,
      withClass: true,
      withLocation: true,
      withAgendaBooking: true,
    });

    if (agendas.length > 0) {
      console.error('User already has an agenda at this time', agendas);
      return new Error(
        `User already has an agenda at this time, ${agendas[0]?.time}`
      );
    }

    return undefined;
  }

  async createAgendaBooking(data: InsertAgendaBookingOption) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }
    const agenda = await this.findOrCreateAgendaFromRecurrence(
      data.time,
      data.agenda_id ?? undefined,
      data.agenda_recurrence_id ?? undefined
    );

    if (agenda instanceof Error) {
      return {
        error: agenda,
      };
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

    const countParticipant = await this._agendaRepository.findAgendaBooking({
      filters: { agenda_id: agenda.id, status: 'booked' },
    });

    if (countParticipant.length >= agendaClass.slot) {
      return {
        error: new Error('Class is full'),
      };
    }

    const expiringCredit =
      await this._packageService.findUserPackageExpiringByUserId(
        user.id,
        agendaClass.class_type_id
      );

    if (expiringCredit.error) {
      return {
        error: expiringCredit.error,
      };
    }

    if (!expiringCredit || expiringCredit.result === undefined) {
      return {
        error: new Error('User does not have any credit for this class'),
      };
    }

    const startTime = agenda.time;
    const endTime = addMinutes(startTime, agendaClass.duration);
    const agendaConflict = await this.checkAgendaConflict(
      user.id,
      startTime,
      endTime
    );

    if (agendaConflict instanceof Error) {
      return {
        error: agendaConflict,
      };
    }

    const createAgendaBooking =
      await this._agendaRepository.createAgendaBooking({
        data: {
          user_id: user.id,
          agenda_id: agenda.id,
          status: 'booked',
        },
      });

    if (createAgendaBooking instanceof Error) {
      return {
        error: createAgendaBooking,
      };
    }

    const createCreditTransaction = await this._creditRepository.create({
      data: {
        agenda_booking_id: createAgendaBooking.id,
        class_type_id: agendaClass.class_type_id,
        note: `Booked For ${user.name} in the ${agendaClass.name} class on ${format(agenda.time, 'dd MMM yyyy - HH:mm')}`,
        user_id: user.id,
        user_package_id: expiringCredit.result.id,
      },
    });

    if (createCreditTransaction instanceof Error) {
      return {
        error: createCreditTransaction,
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
      result: createAgendaBooking,
      error: undefined,
    };
  }

  async createAgendaBookingByAdmin(data: InsertAgendaBookingByAdminOption) {
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

    const agenda = await this.findOrCreateAgendaFromRecurrence(
      data.time,
      data.agenda_id ?? undefined,
      data.agenda_recurrence_id ?? undefined
    );

    if (agenda instanceof Error) {
      return {
        error: agenda,
      };
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

    const countParticipant = await this._agendaRepository.findAgendaBooking({
      filters: { agenda_id: agenda.id, status: 'booked' },
    });

    if (countParticipant.length >= agendaClass.slot) {
      return {
        error: new Error('Class is full'),
      };
    }

    const expiringCredit =
      await this._packageService.findUserPackageExpiringByUserId(
        useUserCredit.id,
        agendaClass.class_type_id
      );

    if (expiringCredit.error) {
      return {
        error: expiringCredit.error,
      };
    }

    if (!expiringCredit || !expiringCredit.result) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    const startTime = agenda.time;
    const endTime = addMinutes(startTime, agendaClass.duration);
    const agendaConflict = await this.checkAgendaConflict(
      useUserCredit.id,
      startTime,
      endTime
    );

    if (agendaConflict instanceof Error) {
      return {
        error: agendaConflict,
      };
    }

    const createAgendaBooking =
      await this._agendaRepository.createAgendaBooking({
        data: { user_id: data.user_id, agenda_id: agenda.id, status: 'booked' },
      });

    if (createAgendaBooking instanceof Error) {
      return {
        error: createAgendaBooking,
      };
    }

    const createCreditTransaction = await this._creditRepository.create({
      data: {
        agenda_booking_id: createAgendaBooking.id,
        class_type_id: agendaClass.class_type_id,
        note: `Booked For ${user.name} in the ${agendaClass.name} class on ${format(agenda.time, 'dd MMM yyyy - HH:mm')}`,
        user_id: useUserCredit.id,
        user_package_id: expiringCredit.result.id,
      },
    });

    if (createCreditTransaction instanceof Error) {
      return {
        error: createCreditTransaction,
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
      result: createAgendaBooking,
    };
  }

  async update(data: UpdateAgenda) {
    // if data.id is undefined, create a new agenda
    if (
      !data.id ||
      (await this._agendaRepository.find({ filters: { id: data.id } }))
        .length === 0
    ) {
      if (data.time === undefined) {
        console.error('Time is required');
        return {
          error: new Error('Time is required'),
        };
      }
      if (!data.class_id) {
        console.error('Class ID is required');
        return {
          error: new Error('Class ID is required'),
        };
      }
      if (data.coach_id === undefined) {
        console.error('Coach ID is required');
        return {
          error: new Error('Coach ID is required'),
        };
      }
      if (data.location_facility_id === undefined) {
        console.error('Location Facility ID is required');
        return {
          error: new Error('Location Facility ID is required'),
        };
      }
      const createAgenda = await this.create({
        data: {
          is_show: data.is_show,
          class_id: data.class_id,
          coach_id: data.coach_id,
          location_facility_id: data.location_facility_id,
          time: data.time,
          agenda_recurrence_id: data.agenda_recurrence_id,
        },
      });

      if (createAgenda instanceof Error) {
        return {
          error: createAgenda,
        };
      }
    } else {
      const updateAgenda = await this._agendaRepository.update({
        data,
        filters: { id: data.id },
      });

      if (updateAgenda instanceof Error) {
        return {
          error: updateAgenda,
        };
      }
    }

    return {
      result: null,
    };
  }

  async updateAgendaRecurrence(data: UpdateAgendaRecurrence) {
    const isDateSame = (currentDate?: Date, newDate?: Date) => {
      if (currentDate === undefined || newDate === undefined) {
        return false;
      }
      return currentDate.toISOString() === newDate.toISOString();
    };

    const isDateDifferent = (currentDate?: Date, newDate?: Date) => {
      if (currentDate === undefined || newDate === undefined) {
        return false;
      }
      return currentDate.toISOString() !== newDate.toISOString();
    };

    if (!data.id) {
      console.error('Agenda recurrence ID is required');
      return {
        error: new Error('Agenda recurrence ID is required'),
      };
    }
    const currentAgendaRecurrence = await this.findAgendaRecurrenceById(
      data.id
    );

    if (currentAgendaRecurrence === undefined) {
      console.error('Failed to get current agenda recurrence');
      return {
        error: new Error('Failed to get current agenda recurrence'),
      };
    }

    // check if start_date same from current start_date or end_date same from current end_date
    if (isDateSame(currentAgendaRecurrence.result?.end_date, data.end_date)) {
      // if there are egenda that after the current agenda recurrence
      if (
        isDateDifferent(
          currentAgendaRecurrence.result?.end_date,
          data?.end_date
        )
      ) {
        if (data.end_date === undefined) {
          console.error('End date is required');
          return {
            error: new Error('End date is required'),
          };
        }
        const eb = expressionBuilder<DB, 'agendas' | 'agenda_recurrences'>();
        const checkAgendas = await this._agendaRepository.find({
          filters: {
            agenda_recurrence_id: data.id,
          },
          customFilters: [
            eb('time', '>', data.end_date),
            eb('agendas.deleted_at', 'is', null),
          ],
        });

        if (checkAgendas.length > 0) {
          console.error(
            'There are agendas after the current agenda recurrence'
          );
          return {
            error: new Error(
              `There are ${checkAgendas.length} agendas after the current agenda recurrence`
            ),
          };
        }
      }
      const updateAgendaRecurrence =
        await this._agendaRepository.updateAgendaRecurrence({
          data,
          filters: { id: data.id },
        });
      if (updateAgendaRecurrence instanceof Error) {
        return {
          error: updateAgendaRecurrence,
        };
      }
    } else {
      // when start date different from current start date we need to split the agenda
      if (data.coach_id === undefined) {
        console.error('Coach ID is required');
        return {
          error: new Error('Coach ID is required'),
        };
      }
      if (data.location_facility_id === undefined) {
        console.error('Location Facility ID is required');
        return {
          error: new Error('Location Facility ID is required'),
        };
      }
      if (data.day_of_week === undefined) {
        console.error('Day of week is required');
        return {
          error: new Error('Day of week is required'),
        };
      }
      if (data.time === undefined) {
        console.error('Time is required');
        return {
          error: new Error('Time is required'),
        };
      }
      if (data.start_date === undefined) {
        console.error('Start date is required');
        return {
          error: new Error('Start date is required'),
        };
      }
      if (data.end_date === undefined) {
        console.error('End date is required');
        return {
          error: new Error('End date is required'),
        };
      }
      if (data.class_id === undefined) {
        console.error('Class ID is required');
        return {
          error: new Error('Class ID is required'),
        };
      }

      const checkCoachAgendaRecurrenceAvailability =
        await this.checkCoachAgendaRecurrenceAvailability(
          data.coach_id,
          data.day_of_week,
          data.time,
          data.time,
          format(data.start_date, 'yyyy-MM-dd'),
          format(data.end_date, 'yyyy-MM-dd')
        );

      if (checkCoachAgendaRecurrenceAvailability instanceof Error) {
        return {
          error: checkCoachAgendaRecurrenceAvailability,
        };
      }

      // update current agenda recurrence
      const updateCurrentAgendaRecurrence =
        await this._agendaRepository.updateAgendaRecurrence({
          data: {
            end_date: subDays(data.start_date, 1),
          },
          filters: { id: data.id },
        });

      if (updateCurrentAgendaRecurrence instanceof Error) {
        return {
          error: updateCurrentAgendaRecurrence,
        };
      }

      const createNewAgendaRecurrence =
        await this._agendaRepository.createAgendaRecurrence({
          data: {
            coach_id: data.coach_id,
            class_id: data.class_id,
            location_facility_id: data.location_facility_id,
            day_of_week: data.day_of_week,
            time: data.time,
            start_date: data.start_date,
            end_date: data.end_date,
          },
        });

      if (createNewAgendaRecurrence instanceof Error) {
        return {
          error: createNewAgendaRecurrence,
        };
      }

      // get all agendas that after the current agenda recurrence, and update the agenda_recurrence_id and everything
      const eb = expressionBuilder<DB, 'agendas' | 'agenda_recurrences'>();
      // with date-fns set date to new date
      const updateAgendas = await this._agendaRepository.update({
        data: {
          time: sql<Date>`CONCAT(DATE(time), ' ', ${data.time})` as any,
          agenda_recurrence_id: createNewAgendaRecurrence.id,
          class_id: data.class_id,
          coach_id: data.coach_id,
          location_facility_id: data.location_facility_id,
        },
        customFilters: [
          eb('agenda_recurrence_id', '=', data.id),
          eb('time', '>', data.start_date),
        ],
      });

      if (updateAgendas instanceof Error) {
        return {
          error: updateAgendas,
        };
      }
    }

    return {
      result: null,
    };
  }

  async updateAgendaBookingById(data: UpdateAgendaBooking) {
    const result = await this._agendaRepository.updateAgendaBooking({
      data,
      filters: { id: data.id },
    });

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    // loyalty rewards
    if (data.status === 'checked_in') {
      // check if loyalty reward already exists
      const agendaBooking = (
        await this._agendaRepository.findAgendaBooking({
          filters: { id: data.id },
        })
      )?.[0];

      if (!agendaBooking) {
        return {
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
          error: new Error('Loyalty reward already exists'),
        };
      }

      const agenda = await this.findById(agendaBooking.agenda_id as number);

      if (agenda.error) {
        return {
          error: agenda.error,
        };
      }

      if (!agenda || agenda.result === undefined) {
        return {
          error: new Error('Agenda not found'),
        };
      }

      const singleClass = await this._classRepository.findById(
        agenda.result.class_id
      );

      if (!singleClass) {
        return {
          error: new Error('Class not found'),
        };
      }

      const user = await this._userRepository.findById(agendaBooking.user_id);

      if (!user) {
        return {
          error: new Error('User not found'),
        };
      }

      const loyalty = await this._loyaltyRepository.createOnReward({
        reward_id: 1,
        user_id: user.id,
        note: `Checked in to ${singleClass.name} class on ${agenda.result.time}`,
        reference_id: agendaBooking.id,
      });

      if (loyalty instanceof Error) {
        return {
          error: new Error('Failed to create loyalty reward', loyalty),
        };
      }
    }

    return {
      result: null,
    };
  }

  async delete(data: DeleteAgenda) {
    if (data.id === undefined || data.id === null || data.id === 0) {
      if (data.time === undefined) {
        console.error('Time is required');
        return {
          error: new Error('Time is required'),
        };
      }
      if (!data.agenda_recurrence_id || data.agenda_recurrence_id === 0) {
        console.error('Agenda recurrence ID is required');
        return {
          error: new Error('Agenda recurrence ID is required'),
        };
      }

      const createAgenda = await this._agendaRepository.create({
        data: {
          is_show: 0,
          class_id: data.class_id,
          coach_id: data.coach_id,
          location_facility_id: data.location_facility_id,
          time: data.time,
          agenda_recurrence_id: data.agenda_recurrence_id,
          deleted_at: new Date(),
        },
      });

      if (createAgenda instanceof Error) {
        return {
          error: createAgenda,
        };
      }

      return {
        result: null,
      };
    }

    // if there is an agenda id, delete the agenda
    const agenda = await this.findById(data.id);

    if (!agenda || agenda.error) {
      return {
        error: agenda.error || new Error('Agenda not found'),
      };
    }

    const agendaClass = await this._classRepository.findDeletedById(
      agenda.result.class_id
    );

    if (!agendaClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.result.location_facility_id
      );

    if (!agendaLocation) {
      return {
        error: new Error('Location not found'),
      };
    }

    const agendaBookings = await this.findAllAgendaBookingByAgendaId(data.id);

    if (agendaBookings.error) {
      return {
        error: agendaBookings.error,
      };
    }

    const updateAgendaBooking =
      await this._agendaRepository.updateAgendaBooking({
        data: { status: 'cancelled' },
        filters: { agenda_id: data.id },
      });

    if (updateAgendaBooking instanceof Error) {
      return {
        error: updateAgendaBooking,
      };
    }

    if (data.is_refund) {
      const eb = expressionBuilder<DB, 'credit_transactions'>();
      const deleteCreditTransaction = await this._creditRepository.delete({
        customFilters: [
          eb(
            'agenda_booking_id',
            'in',
            agendaBookings.result.map((a) => a.id)
          ),
        ],
      });

      if (deleteCreditTransaction instanceof Error) {
        return {
          error: deleteCreditTransaction,
        };
      }
    }

    for (const booking of agendaBookings.result) {
      const user = await this._userRepository.findById(booking.user_id);

      if (!user) {
        return {
          error: new Error('User not found'),
        };
      }

      const notification = await this._notificationService.sendNotification({
        payload: {
          type: NotificationType.AdminDeletedAgenda,
          date: agenda.result.time,
          class: agendaClass.name,
          location: agendaLocation.name,
          is_refund: data.is_refund,
        },
        recipient: user.phone_number,
      });

      if (notification.error) {
        return {
          error: notification.error,
        };
      }
    }

    return {
      result: null,
    };
  }

  async deleteAgendaRecurrence(id: SelectAgendaRecurrence['id']) {
    const agendaRecurrence = await this.findAgendaRecurrenceById(id);
    if (!agendaRecurrence || agendaRecurrence.error) {
      return {
        error:
          agendaRecurrence.error || new Error('Agenda recurrence not found'),
      };
    }

    const deleteAgendaRecurrence =
      await this._agendaRepository.deleteAgendaRecurrence({
        filters: { id: id },
      });

    if (deleteAgendaRecurrence instanceof Error) {
      return {
        error: deleteAgendaRecurrence,
      };
    }

    return {
      result: null,
    };
  }

  async cancelAgendaBookingByAdmin(data: CancelAgendaBookingByAdminOption) {
    const eb = expressionBuilder<
      DB,
      'agendas' | 'agenda_bookings' | 'credit_transactions'
    >();
    const agenda = (
      await this._agendaRepository.find({
        customFilters: [
          eb('agendas.deleted_at', 'is', null),
          eb('agenda_bookings.id', '=', data.id),
        ],
        withAgendaBooking: true,
        withClass: true,
        withLocation: true,
      })
    )?.[0];

    if (agenda === undefined) {
      console.error('Failed to get agenda booking', agenda);
      return {
        error: new Error('Failed to get agenda booking'),
      };
    }

    const agendaBooking = await this.findAgendaBookingById(data.id);

    if (agendaBooking.error) {
      return {
        error: agendaBooking.error,
      };
    }

    const user = await this._userRepository.findById(
      agendaBooking.result.user_id
    );

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    await this._agendaRepository.updateAgendaBooking({
      data: { status: 'cancelled' },
      filters: { id: data.id },
    });

    if (data.type === 'refund') {
      const deleteCreditTransaction = await this._creditRepository.delete({
        customFilters: [eb('agenda_booking_id', '=', data.id)],
      });

      if (deleteCreditTransaction instanceof Error) {
        return {
          error: deleteCreditTransaction,
        };
      }
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.AdminCancelledUserAgenda,
        date: agenda.time,
        class: agenda.class_name,
        location: agenda.location_name,
        facility: agenda.location_facility_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
      };
    }

    return {
      result: null,
    };
  }

  async cancelAgendaBookingByUser(data: CancelAgendaBookingByUserOption) {
    const eb = expressionBuilder<
      DB,
      'agendas' | 'agenda_bookings' | 'credit_transactions'
    >();

    const agenda = (
      await this._agendaRepository.find({
        customFilters: [
          eb('agendas.deleted_at', 'is', null),
          eb('agenda_bookings.id', '=', data.id),
        ],
        withAgendaBooking: true,
        withClass: true,
        withLocation: true,
      })
    )?.[0];

    if (agenda === undefined) {
      console.error('Failed to get agenda booking', agenda);
      return {
        error: new Error('Failed to get agenda booking'),
      };
    }

    const agendaBooking = await this.findAgendaBookingById(data.id);

    if (agendaBooking.error) {
      return {
        error: agendaBooking.error,
      };
    }

    const user = await this._userRepository.findById(
      agendaBooking.result.user_id
    );

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    const agendaTime = agenda.time;
    const now = new Date();

    const hoursDifference = differenceInHours(agendaTime, now);

    if (hoursDifference < 24 && isBefore(now, agendaTime)) {
      return {
        result: undefined,
        error: new Error('The agenda is less than 24 hours away'),
      };
    }

    const updateAgendaBooking =
      await this._agendaRepository.updateAgendaBooking({
        data: { status: 'cancelled' },
        filters: { id: data.id },
      });

    if (updateAgendaBooking instanceof Error) {
      return {
        error: updateAgendaBooking,
      };
    }

    const deleteCreditTransaction = await this._creditRepository.delete({
      customFilters: [eb('agenda_booking_id', '=', data.id)],
    });

    if (deleteCreditTransaction instanceof Error) {
      return {
        error: deleteCreditTransaction,
      };
    }

    return {
      result: null,
    };
  }

  async findAllCoachAgendaByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ) {
    const { date, location_id } = data;
    const queryAgenda = await db
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .select([
        'coaches.id as coach_id',
        'users.name as coach_name',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        sql<number>`count(agendas.id)`.as('total'),
      ])
      .where('locations.id', '=', location_id)
      .where(sql`MONTH(agendas.time)`, '=', format(date, 'MM'))
      .where(sql`YEAR(agendas.time)`, '=', format(date, 'yyyy'))
      .groupBy('users.id')
      .groupBy('class_types.id')
      .execute();

    // transform data
    const transformedAgenda = queryAgenda.reduce<SelectCoachAgendaBooking[]>(
      (acc, item) => {
        const coach = acc.find((coach) => coach.coach_id === item.coach_id);

        if (coach === undefined) {
          acc.push({
            coach_id: item.coach_id,
            coach_name: item.coach_name,
            agenda: [
              {
                class_type_id: item.class_type_id,
                class_type_name: item.class_type_name,
                total: item.total,
              },
            ],
            agenda_count: 0,
          });
        } else {
          coach.agenda.push({
            class_type_id: item.class_type_id,
            class_type_name: item.class_type_name,
            total: item.total,
          });
        }

        return acc;
      },
      []
    );

    const queryDays = await db
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .select([
        'coaches.id',
        sql<number>`COUNT(DISTINCT DAY(agendas.time))`.as('days_with_agendas'),
      ])
      .where('locations.id', '=', location_id)
      .where(sql`MONTH(agendas.time)`, '=', format(date, 'MM'))
      .where(sql`YEAR(agendas.time)`, '=', format(date, 'yyyy'))
      .groupBy('coaches.id')
      .execute();

    const transformedData = transformedAgenda.map((coach) => {
      const days = queryDays.find((day) => day.id === coach.coach_id);

      return {
        ...coach,
        agenda_count: days?.days_with_agendas ?? 0,
      };
    });

    return {
      result: transformedData,
      error: undefined,
    };
  }
}
