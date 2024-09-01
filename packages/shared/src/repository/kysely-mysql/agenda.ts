import { inject, injectable } from 'inversify';
import {
  FindAllAgendaOptions,
  InsertAgenda,
  AgendaRepository,
  SelectAgenda,
  UpdateAgenda,
  InsertAgendaBooking,
  SelectAgendaBooking,
  UpdateAgendaBooking,
  SelectParticipant,
  FindScheduleByDateOptions,
  SelectAllSchedule,
  FindAgendaByUserOptions,
  SelectAllAgendaByUser,
  InsertAgendaAndTransaction,
  FindAllAgendaByCoachOptions,
  SelectScheduleByDate,
  UpdateAgendaBookingById,
  DeleteAgenda,
  UpdateAgendaBookingParticipant,
  CancelAgenda,
  DeleteParticipant,
  InsertAgendaBookingAndTransactionByAdmin,
  InsertAgendaRecurrence,
  SelectAgendaRecurrence,
} from '../agenda';
import { Database, db, Users } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { Selectable, sql } from 'kysely';
import { SelectCoach } from '../coach';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import { SelectUser } from '../user';

@injectable()
export class KyselyMySqlAgendaRepository implements AgendaRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('agendas')
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async countParticipant(id: SelectAgenda['id']) {
    const query = await this._db
      .selectFrom('agenda_bookings')
      .select(({ fn }) => [fn.count<number>('agenda_bookings.id').as('count')])
      .where('agenda_id', '=', id)
      .where('status', '=', 'booked')
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async countCheckedInByUserId(userId: SelectUser['id']) {
    const query = await this._db
      .selectFrom('agenda_bookings')
      .select(({ fn }) => [fn.count<number>('agenda_bookings.id').as('count')])
      .where('agenda_bookings.user_id', '=', userId)
      .where('agenda_bookings.status', '=', 'checked_in')
      .executeTakeFirst();

    return query?.count;
  }

  async countCoachAgenda(userId: SelectCoach['user_id']) {
    const query = await this._db
      .selectFrom('agendas')
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .where('coaches.user_id', '=', userId)
      .executeTakeFirst();

    return query?.count ?? 0;
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

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['agendas.time', 'asc']
    ).join(' ') as `${keyof SelectAgenda} ${'asc' | 'desc'}`;

    let query = this._db
      .with('agenda_data', (eb) =>
        eb
          .selectFrom('agendas')
          .select([
            sql<number | null>`agendas.id`.as('id'),
            'agendas.coach_id',
            'agendas.class_id',
            'agendas.location_facility_id',
            'agendas.agenda_recurrence_id',
            'agendas.time',
          ])
          .where(sql`DATE(agendas.time)`, '=', date)
      )
      .with('missing_recurrences', (eb) =>
        eb
          .selectFrom('agenda_recurrences')
          .select([
            sql<null>`null`.as('id'),
            'agenda_recurrences.coach_id',
            'agenda_recurrences.class_id',
            'agenda_recurrences.location_facility_id',
            'agenda_recurrences.id as agenda_recurrence_id',
            sql<Date>`ADDDATE(${date} - INTERVAL (DAYOFWEEK(${date}) - 1) DAY, INTERVAL TIME_TO_SEC(agenda_recurrences.time) / 60 MINUTE)`.as(
              'time'
            ),
          ])
          .leftJoin(
            'agenda_data',
            'agenda_data.agenda_recurrence_id',
            'agenda_recurrences.id'
          )
          .where('agenda_data.id', 'is', null)
          .where(
            'agenda_recurrences.day_of_week',
            '=',
            sql<number>`DAYOFWEEK(${date}) - 1`
          )
      )
      .with('agendas', (eb) =>
        eb
          .selectFrom('agenda_data')
          .selectAll()
          .unionAll(eb.selectFrom('missing_recurrences').selectAll())
      )
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id');

    if (className) {
      query = query.where('classes.name', 'like', `%${className}%`);
    }

    if (coaches?.length && coaches.length > 0) {
      query = query.where('coaches.id', 'in', coaches);
    }

    if (locations?.length && locations.length > 0) {
      query = query.where('locations.id', 'in', locations);
    }

    const queryData = await query
      .selectAll('agendas')
      .select((eb) => [
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'classes.slot',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        eb
          .selectFrom('users')
          .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
          .select(
            sql<
              SelectParticipant[]
            >`coalesce(json_arrayagg(json_object('agenda_booking_id', agenda_bookings.id, 'name', users.name,'user_id', users.id)), '[]')`.as(
              'participants'
            )
          )
          .where('agenda_bookings.status', '!=', 'cancelled')
          .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
          .as('participants'),
      ])

      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  findById(id: SelectAgenda['id']) {
    return this._db
      .selectFrom('agendas')
      .selectAll()
      .where('agendas.id', '=', id)
      .executeTakeFirst();
  }

  async findAllAgendaRecurrence() {
    const query = await this._db
      .selectFrom('agenda_recurrences')
      .selectAll()
      .execute();

    return query;
  }

  async findAllAgendaRecurrenceByDay(
    day: SelectAgendaRecurrence['day_of_week']
  ): Promise<SelectAgendaRecurrence[]> {
    const query = await this._db
      .selectFrom('agenda_recurrences')
      .selectAll()
      .where('day_of_week', '=', day)
      .execute();

    return query;
  }

  findAllAgendaBookingByAgendaId(
    id: SelectAgenda['id']
  ): Promise<SelectAgendaBooking[]> {
    return this._db
      .selectFrom('agenda_bookings')
      .selectAll()
      .where('agenda_id', '=', id)
      .execute();
  }

  findAgendaBookingById(id: SelectAgendaBooking['id']) {
    return this._db
      .selectFrom('agenda_bookings')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  findAllParticipantByAgendaId(id: SelectAgenda['id']) {
    return this._db
      .selectFrom('agenda_bookings')
      .innerJoin('users', 'agenda_bookings.user_id', 'users.id')
      .select(['agenda_bookings.status', 'name', 'agenda_bookings.id'])
      .where('agenda_id', '=', id)
      .execute();
  }

  async findTodayScheduleByCoachId(coachUserId: SelectCoach['user_id']) {
    const query = (await this._db
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.agenda_recurrence_id',
        'agendas.location_facility_id',
        'classes.slot',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'locations.link_maps as location_link_maps',
        'locations.address as location_address',
        'location_facilities.name as location_facility_name',
        eb
          .selectFrom('users')
          .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
          .select(sql<number>`count(agenda_bookings.id)`.as('participant'))
          .where('agenda_bookings.status', '=', 'booked')
          .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
          .as('participant'),
      ])
      .where('coaches.user_id', '=', coachUserId)
      .where('agendas.time', '>=', new Date())
      .where('agendas.time', '<', addDays(new Date(), 1))
      .execute()) satisfies SelectScheduleByDate[];

    return query;
  }

  async findAllByCoachId(
    data: FindAllAgendaByCoachOptions
  ): Promise<SelectAllSchedule> {
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

    let query = this._db
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .where('coaches.user_id', '=', coachUserId);

    if (classTypes?.length && classTypes.length > 0) {
      query = query.where('class_types.id', 'in', classTypes);
    }

    if (locations?.length && locations.length > 0) {
      query = query.where('locations.id', 'in', locations);
    }

    if (date) {
      const today = startOfDay(new Date(date));
      const tomorrow = endOfDay(today);

      query = query
        .where('agendas.time', '>=', date)
        .where('agendas.time', '<=', tomorrow);
    }

    const queryData = await query
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.location_facility_id',
        'agendas.agenda_recurrence_id',
        'classes.slot',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'locations.link_maps as location_link_maps',
        'locations.address as location_address',
        'location_facilities.name as location_facility_name',
        eb
          .selectFrom('users')
          .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
          .select(sql<number>`count(agenda_bookings.id)`.as('participant'))
          .where('agenda_bookings.status', '=', 'booked')
          .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
          .as('participant'),
      ])

      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData satisfies SelectAllSchedule['data'],
      pageCount: pageCount,
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

    let query = this._db
      .with('agenda_data', (eb) =>
        eb
          .selectFrom('agendas')
          .select([
            sql<number | null>`agendas.id`.as('id'),
            'agendas.coach_id',
            'agendas.class_id',
            'agendas.location_facility_id',
            'agendas.agenda_recurrence_id',
            'agendas.time',
            'agendas.is_show',
          ])
          .where(sql`DATE(agendas.time)`, '=', date)
      )
      .with('missing_recurrences', (eb) =>
        eb
          .selectFrom('agenda_recurrences')
          .select([
            sql<null>`null`.as('id'),
            'agenda_recurrences.coach_id',
            'agenda_recurrences.class_id',
            'agenda_recurrences.location_facility_id',
            'agenda_recurrences.id as agenda_recurrence_id',
            sql<Date>`ADDDATE(${date} - INTERVAL (DAYOFWEEK(${date}) - 1) DAY, INTERVAL TIME_TO_SEC(agenda_recurrences.time) / 60 MINUTE)`.as(
              'time'
            ),
          ])
          .leftJoin(
            'agenda_data',
            'agenda_data.agenda_recurrence_id',
            'agenda_recurrences.id'
          )
          .where('agenda_data.id', 'is', null)
          .where(
            'agenda_recurrences.day_of_week',
            '=',
            sql<number>`DAYOFWEEK(${date}) - 1`
          )
      )
      .with('agendas', (eb) =>
        eb
          .selectFrom('agenda_data')
          .select([
            'id',
            'coach_id',
            'class_id',
            'location_facility_id',
            'agenda_recurrence_id',
            'time',
          ])
          .where('is_show', '=', 1)
          .unionAll(eb.selectFrom('missing_recurrences').selectAll())
      )
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id');

    if (classTypes?.length && classTypes.length > 0) {
      query = query.where('class_types.id', 'in', classTypes);
    }

    if (coaches?.length && coaches.length > 0) {
      query = query.where('coaches.id', 'in', coaches);
    }

    if (locations?.length && locations.length > 0) {
      query = query.where('locations.id', 'in', locations);
    }

    if (classNames?.length && classNames.length > 0) {
      query = query.where('classes.id', 'in', classNames);
    }

    if (date) {
      const today = new Date(date);
      const tomorrow = endOfDay(today);

      query = query
        .where('agendas.time', '>=', today)
        .where('agendas.time', '<=', tomorrow);
    }

    const queryData = await query
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.location_facility_id',
        'agendas.agenda_recurrence_id',
        'classes.slot',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'locations.link_maps as location_link_maps',
        'locations.address as location_address',
        'location_facilities.name as location_facility_name',
        eb
          .selectFrom('users')
          .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
          .select(sql<number>`count(agenda_bookings.id)`.as('participant'))
          .where('agenda_bookings.status', '=', 'booked')
          .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
          .as('participant'),
      ])

      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();
    const test = queryData[0];
    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData satisfies SelectAllSchedule['data'],
      pageCount: pageCount,
    };
  }

  async findScheduleById(id: SelectAgenda['id']) {
    const schedule = await this._db
      .selectFrom('agendas')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.location_facility_id',
        'agendas.agenda_recurrence_id',
        'classes.slot',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'locations.link_maps as location_link_maps',
        'locations.address as location_address',
        'location_facilities.name as location_facility_name',
        eb
          .selectFrom('users')
          .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
          .select(sql<number>`count(agenda_bookings.id)`.as('participant'))
          .where('agenda_bookings.status', '=', 'booked')
          .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
          .as('participant'),
      ])
      .where('agendas.id', '=', id)
      .executeTakeFirst();

    return schedule;
  }

  async findAgendaByUserId(data: FindAgendaByUserOptions) {
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

    let query = this._db
      .selectFrom('agenda_bookings')
      .leftJoin('agendas', 'agenda_bookings.agenda_id', 'agendas.id')
      .leftJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .leftJoin('users', 'coaches.user_id', 'users.id')
      .leftJoin('classes', 'agendas.class_id', 'classes.id')
      .leftJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .leftJoin('locations', 'location_facilities.location_id', 'locations.id')
      .leftJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .where('agenda_bookings.user_id', '=', userId);

    if (classTypes?.length && classTypes.length > 0) {
      query = query.where('class_types.id', 'in', classTypes);
    }

    if (coaches?.length && coaches.length > 0) {
      query = query.where('coaches.id', 'in', coaches);
    }

    if (locations?.length && locations.length > 0) {
      query = query.where('locations.id', 'in', locations);
    }

    const queryData = await query
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.location_facility_id',
        'agendas.agenda_recurrence_id',
        'classes.slot',
        'agenda_bookings.id as agenda_booking_id',
        'agenda_bookings.status as agenda_booking_status',
        'agenda_bookings.created_at as agenda_booking_updated_at',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'location_facilities.name as location_facility_name',
      ])

      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData satisfies SelectAllAgendaByUser['data'],
      pageCount: pageCount,
    };
  }

  async findActiveAgendaByUserId(
    data: number
  ): Promise<SelectAllAgendaByUser['data']> {
    const query = await this._db
      .selectFrom('agendas')
      .innerJoin('agenda_bookings', 'agenda_bookings.agenda_id', 'agendas.id')
      .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .innerJoin('classes', 'agendas.class_id', 'classes.id')
      .innerJoin(
        'location_facilities',
        'agendas.location_facility_id',
        'location_facilities.id'
      )
      .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
      .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
      .select((eb) => [
        'agendas.class_id',
        'agendas.id',
        'agendas.time',
        'agendas.location_facility_id',
        'agendas.agenda_recurrence_id',
        'classes.slot',
        'agenda_bookings.id as agenda_booking_id',
        'agenda_bookings.status as agenda_booking_status',
        'agenda_bookings.created_at as agenda_booking_updated_at',
        'users.name as coach_name',
        'coaches.id as coach_id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'class_types.id as class_type_id',
        'class_types.type as class_type_name',
        'locations.name as location_name',
        'locations.id as location_id',
        'location_facilities.name as location_facility_name',
      ])
      .where('agenda_bookings.user_id', '=', data)
      .where('agenda_bookings.status', '=', 'booked')
      .execute();

    return query;
  }

  async create(data: InsertAgenda) {
    try {
      // Check if the coach is available
      const duration = await this._db
        .selectFrom('classes')
        .select(['duration'])
        .where('id', '=', data.class_id)
        .executeTakeFirst();

      if (duration === undefined) {
        console.error('Failed to get class duration', duration);
        return new Error('Failed to get class duration');
      }
      const startTime = new Date(data.time);
      const endTime = new Date(data.time);
      endTime.setMinutes(endTime.getMinutes() + duration.duration);

      const coachAvailability = await this._db
        .selectFrom('agendas')
        .select(['agendas.id'])
        .innerJoin('classes', 'agendas.class_id', 'classes.id')
        .where('coach_id', '=', data.coach_id)
        .where((eb) =>
          // if there are start agenda time between the new agenda time
          eb.or([
            eb('agendas.time', '>', startTime).and(
              'agendas.time',
              '<',
              endTime
            ),
            eb(
              sql`ADDTIME(agendas.time, SEC_TO_TIME(classes.duration * 60))`,
              '>',
              startTime
            ).and(
              sql`ADDTIME(agendas.time, SEC_TO_TIME(classes.duration * 60))`,
              '<',
              endTime
            ),
          ])
        )
        .executeTakeFirst();

      if (coachAvailability !== undefined) {
        console.error('Coach is not available', coachAvailability);
        return new Error('Coach is not available');
      }

      const query = this._db
        .insertInto('agendas')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create agenda', result);
        return new Error('Failed to create agenda');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating agenda:', error);
      return new Error('Error creating agenda');
    }
  }

  async createAgendaRecurrence(data: InsertAgendaRecurrence) {
    try {
      const query = this._db
        .insertInto('agenda_recurrences')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create agenda recurrence', result);
        return new Error('Failed to create agenda recurrence');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating agenda recurrence:', error);
      return new Error('Error creating agenda recurrence');
    }
  }

  async createAgendaBooking(data: InsertAgendaAndTransaction) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const agendaBooking = trx
          .insertInto('agenda_bookings')
          .values({
            agenda_id: data.agenda_id,
            user_id: data.user_id,
            status: 'booked',
          })
          .returningAll()
          .compile();

        const resultAgendaBooking = await this._db.executeQuery(agendaBooking);

        if (resultAgendaBooking.rows[0] === undefined) {
          console.error('Failed to create agenda booking', resultAgendaBooking);
          return new Error('Failed to create agenda booking');
        }

        const credit = trx
          .insertInto('credit_transactions')
          .values({
            credit_transaction_id: data.credit_transaction_id,
            agenda_booking_id: resultAgendaBooking.rows[0].id,
            user_id: data.user_id,
            type: data.type,
            amount: data.amount,
            class_type_id: data.class_type_id,
            note: data.note,
          })
          .returningAll()
          .compile();

        const resultCredit = await this._db.executeQuery(credit);

        if (resultCredit.rows[0] === undefined) {
          console.error('Failed to create credit transaction', resultCredit);
          return new Error('Failed to create credit transaction');
        }
        return resultAgendaBooking.rows[0];
      });
      return result;
    } catch (error) {
      console.error('Error creating agenda booking:', error);
      return new Error('Error creating agenda booking');
    }
  }

  async createAgendaBookingByAdmin(
    data: InsertAgendaBookingAndTransactionByAdmin
  ) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const agendaBooking = trx
          .insertInto('agenda_bookings')
          .values({
            agenda_id: data.agenda_id,
            user_id: data.user_id,
            status: 'booked',
          })
          .returningAll()
          .compile();

        const resultAgendaBooking = await this._db.executeQuery(agendaBooking);

        if (resultAgendaBooking.rows[0] === undefined) {
          console.error('Failed to create agenda booking', resultAgendaBooking);
          return new Error('Failed to create agenda booking');
        }

        const credit = trx
          .insertInto('credit_transactions')
          .values({
            credit_transaction_id: data.credit_transaction_id,
            agenda_booking_id: resultAgendaBooking.rows[0].id,
            user_id: data.used_credit_user_id,
            type: data.type,
            amount: data.amount,
            class_type_id: data.class_type_id,
            note: data.note,
          })
          .returningAll()
          .compile();

        const resultCredit = await this._db.executeQuery(credit);

        if (resultCredit.rows[0] === undefined) {
          console.error('Failed to create credit transaction', resultCredit);
          return new Error('Failed to create credit transaction');
        }
        return resultAgendaBooking.rows[0];
      });
      return result;
    } catch (error) {
      console.error('Error creating agenda booking:', error);
      return new Error('Error creating agenda booking');
    }
  }

  async update(data: UpdateAgenda) {
    try {
      const query = await this._db
        .updateTable('agendas')
        .set(data)
        .where('id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update agenda', query.numUpdatedRows);
        return new Error('Failed to update agenda');
      }

      return;
    } catch (error) {
      console.error('Error updating agenda:', error);
      return new Error('Error updating agenda');
    }
  }

  async updateAgendaRecurrence(data: SelectAgendaRecurrence) {
    try {
      const query = await this._db
        .updateTable('agenda_recurrences')
        .set(data)
        .where('id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error(
          'Failed to update agenda recurrence',
          query.numUpdatedRows
        );
        return new Error('Failed to update agenda recurrence');
      }

      return;
    } catch (error) {
      console.error('Error updating agenda recurrence:', error);
      return new Error('Error updating agenda recurrence');
    }
  }

  async updateAgendaBooking(data: UpdateAgendaBooking) {
    try {
      const curentAgendaBookings = await this._db
        .selectFrom('agenda_bookings')
        .selectAll()
        .where('agenda_bookings.agenda_id', '=', data.agenda_id)
        .where('agenda_bookings.status', '!=', 'cancelled')
        .execute();

      // Create a Set of IDs from data.agendaBookings
      const newBookingIds = new Set(
        data.agendaBookings.map((newBooking) => newBooking.id)
      );

      // Filter currentAgendaBookings based on whether the ID is not in the Set
      const toDelete = curentAgendaBookings.filter(
        (booking) => !newBookingIds.has(booking.id)
      );

      const toInsert = data.agendaBookings.filter(
        (booking) => booking.id === undefined
      );

      await this._db.transaction().execute(async (trx) => {
        await Promise.all(
          toDelete.map((booking) =>
            trx
              .updateTable('agenda_bookings')
              .set({ status: 'cancelled' })
              .where('id', '=', booking.id)
              .execute()
          )
        );

        await Promise.all(
          toInsert.map((booking) =>
            trx
              .insertInto('agenda_bookings')
              .values({
                agenda_id: data.agenda_id,
                user_id: booking.user_id,
                status: 'booked',
              })
              .execute()
          )
        );
      });

      return;
    } catch (error) {
      console.error('Error updating participant:', error);
      return new Error('Error updating participant');
    }
  }
  async updateAgendaBookingParticipant(data: UpdateAgendaBookingParticipant) {
    try {
      const currentClass = await this._db
        .selectFrom('classes')
        .innerJoin('agendas', 'agendas.class_id', 'classes.id')
        .selectAll('classes')
        .select(['agendas.time'])
        .where('agendas.id', '=', data.agenda_id)
        .executeTakeFirst();

      if (currentClass === undefined) {
        console.error('Failed to get class time', currentClass);
        return new Error('Failed to get class time');
      }

      // Filter currentAgendaBookings based on whether the ID is not in the Set
      const toDelete = data.agendaBookings.filter(
        (booking) => booking.delete !== undefined && booking.id !== undefined
      );

      const toInsert = data.agendaBookings.filter(
        (booking) => booking.id === undefined
      );

      await this._db.transaction().execute(async (trx) => {
        await Promise.all(
          toDelete.map(async (booking) => {
            await trx
              .updateTable('agenda_bookings')
              .set({ status: 'cancelled' })
              .where('id', '=', booking.id as number)
              .execute();

            if (booking.delete === 'refund') {
              const tomorrow = addDays(new Date(), 1);
              const debitCreditTransaction = await trx
                .selectFrom('credit_transactions as ct_credit')
                .innerJoin(
                  'credit_transactions as ct_debit',
                  'ct_debit.id',
                  'ct_credit.credit_transaction_id'
                )
                .select(['ct_debit.user_package_id'])
                .where('ct_credit.agenda_booking_id', '=', booking.id ?? 0)
                .where('ct_credit.type', '=', 'credit')
                .executeTakeFirst();

              await trx
                .insertInto('credit_transactions')
                .values({
                  user_id: booking.user_id,
                  type: 'debit',
                  expired_at: tomorrow,
                  class_type_id: currentClass.class_type_id ?? 1,
                  user_package_id: debitCreditTransaction?.user_package_id,
                  amount: 1,
                  note: `Refund for book ${currentClass.name} on ${format(
                    currentClass.time,
                    'yyyy-MM-dd HH:mm'
                  )}`,
                })
                .execute();
            }
          })
        );

        await Promise.all(
          toInsert.map((booking) =>
            trx
              .insertInto('agenda_bookings')
              .values({
                agenda_id: data.agenda_id,
                user_id: booking.user_id,
                status: 'booked',
              })
              .execute()
          )
        );
      });

      return;
    } catch (error) {
      console.error('Error updating participant:', error);
      return new Error('Error updating participant');
    }
  }
  async updateAgendaBookingById(data: UpdateAgendaBookingById) {
    try {
      const query = await this._db
        .updateTable('agenda_bookings')
        .set(data)
        .where('id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update agenda booking', query.numUpdatedRows);
        return new Error('Failed to update agenda booking');
      }

      return;
    } catch (error) {
      console.error('Error updating agenda booking:', error);
      return new Error('Error updating agenda booking');
    }
  }

  async delete(data: DeleteAgenda) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const agenda = await trx
          .selectFrom('agendas')
          .selectAll()
          .where('id', '=', data.id)
          .executeTakeFirst();

        if (agenda === undefined) {
          console.error('Failed to get agenda', agenda);
          return new Error('Failed to get agenda');
        }

        const agendaBookings = await trx
          .selectFrom('agenda_bookings')
          .selectAll()
          .where('agenda_id', '=', data.id)
          .execute();

        const singleClass = await trx
          .selectFrom('classes')
          .selectAll()
          .where('id', '=', agenda.class_id)
          .executeTakeFirst();

        if (singleClass === undefined) {
          console.error('Failed to get class type', singleClass);
          return new Error('Failed to get class type');
        }

        if (agendaBookings.length > 0) {
          await Promise.all(
            agendaBookings.map((booking) =>
              trx
                .updateTable('agenda_bookings')
                .set({ status: 'cancelled' })
                .where('id', '=', booking.id)
                .execute()
            )
          );

          if (data.is_refund) {
            const tomorrow = addDays(new Date(), 1);
            await Promise.all(
              agendaBookings.map(async (booking) => {
                const debitCreditTransaction = await trx
                  .selectFrom('credit_transactions as ct_credit')
                  .innerJoin(
                    'credit_transactions as ct_debit',
                    'ct_debit.id',
                    'ct_credit.credit_transaction_id'
                  )
                  .select(['ct_debit.user_package_id'])
                  .where('ct_credit.agenda_booking_id', '=', booking.id)
                  .where('ct_credit.type', '=', 'credit')
                  .executeTakeFirst();

                trx
                  .insertInto('credit_transactions')
                  .values({
                    user_id: booking.user_id,
                    type: 'debit',
                    expired_at: tomorrow,
                    class_type_id: singleClass.class_type_id,
                    user_package_id: debitCreditTransaction?.user_package_id,
                    amount: 1,
                    note: `Refund for book ${singleClass.name} on ${format(
                      agenda.time,
                      'yyyy-MM-dd HH:mm'
                    )}`,
                  })
                  .execute();
              })
            );
          }
        }

        const query = await trx
          .deleteFrom('agendas')
          .where('id', '=', data.id)
          .executeTakeFirst();

        if (query.numDeletedRows === undefined) {
          console.error('Failed to delete agenda', query);
          return new Error('Failed to delete agenda');
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting agenda:', error);
      return new Error('Error deleting agenda');
    }
  }

  async deleteAgendaRecurrence(id: SelectAgendaRecurrence['id']) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const agendaRecurrence = await trx
          .selectFrom('agenda_recurrences')
          .selectAll()
          .where('id', '=', id)
          .executeTakeFirst();

        if (agendaRecurrence === undefined) {
          console.error('Failed to get agenda recurrence', agendaRecurrence);
          return new Error('Failed to get agenda recurrence');
        }

        const result = await trx
          .deleteFrom('agenda_recurrences')
          .where('id', '=', id)
          .executeTakeFirst();

        if (result.numDeletedRows === undefined) {
          console.error('Failed to delete agenda recurrence', result);
          return new Error('Failed to delete agenda recurrence');
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting agenda recurrence:', error);
      return new Error('Error deleting agenda recurrence');
    }
  }

  async cancel(data: CancelAgenda) {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        // update to canceled
        const query = await trx
          .updateTable('agenda_bookings')
          .set({ status: 'cancelled' })
          .where('id', '=', data.agenda_booking_id)
          .executeTakeFirst();

        if (query.numUpdatedRows === undefined) {
          console.error('Failed to cancel agenda', query);
          return new Error('Failed to cancel agenda');
        }

        // delete credit transaction
        const creditTransaction = await trx
          .deleteFrom('credit_transactions')
          .where('agenda_booking_id', '=', data.agenda_booking_id)
          .where('user_id', '=', data.user_id)
          .where('type', '=', 'credit')
          .executeTakeFirst();

        if (creditTransaction.numDeletedRows === undefined) {
          console.error(
            'Failed to delete credit transaction',
            creditTransaction
          );
          return new Error('Failed to delete credit transaction');
        }
      });
      return result;
    } catch (error) {
      console.error('Error cancelling agenda:', error);
      return new Error('Error cancelling agenda');
    }
  }

  async deleteAgendaBooking(
    data: DeleteParticipant
  ): Promise<undefined | Error> {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const currentAgendaBooking = await trx
          .selectFrom('agenda_bookings')
          .innerJoin('agendas', 'agenda_bookings.agenda_id', 'agendas.id')
          .innerJoin('classes', 'agendas.class_id', 'classes.id')
          .selectAll('agenda_bookings')
          .select(['agendas.time', 'classes.name', 'classes.class_type_id'])
          .where('agenda_bookings.id', '=', data.id)
          .executeTakeFirst();

        if (currentAgendaBooking === undefined) {
          console.error('Failed to get agenda booking', currentAgendaBooking);
          return new Error('Failed to get agenda booking');
        }

        await trx
          .updateTable('agenda_bookings')
          .set({ status: 'cancelled' })
          .where('id', '=', data.id)
          .execute();

        if (data.type === 'refund') {
          const tomorrow = addDays(new Date(), 1);
          const debitCreditTransaction = await trx
            .selectFrom('credit_transactions as ct_credit')
            .innerJoin(
              'credit_transactions as ct_debit',
              'ct_debit.id',
              'ct_credit.credit_transaction_id'
            )
            .select(['ct_debit.user_package_id'])
            .where('ct_credit.agenda_booking_id', '=', data.id)
            .where('ct_credit.type', '=', 'credit')
            .executeTakeFirst();

          const currentCreditTransaction = await trx
            .selectFrom('credit_transactions')
            .select(['credit_transactions.user_id'])
            .where('agenda_booking_id', '=', data.id)
            .where('type', '=', 'credit')
            .executeTakeFirst();

          if (currentCreditTransaction === undefined) {
            console.error(
              'Failed to get credit transaction',
              currentCreditTransaction
            );
            return new Error('Failed to get credit transaction');
          }

          await trx
            .insertInto('credit_transactions')
            .values({
              user_id: currentCreditTransaction.user_id,
              type: 'debit',
              expired_at: tomorrow,
              class_type_id: currentAgendaBooking.class_type_id,
              user_package_id: debitCreditTransaction?.user_package_id,
              amount: 1,
              note: `Refund for book ${currentAgendaBooking.name} on ${format(
                currentAgendaBooking.time,
                'yyyy-MM-dd HH:mm'
              )}`,
            })
            .execute();
        }
      });
    } catch (error) {
      console.error('Error deleting participant:', error);
      return new Error('Error deleting participant');
    }
  }
  // async deleteParticipant(id: SelectAgendaBooking['id']) {
  //   try {
  //     const query = await this._db
  //       .updateTable('agenda_bookings')
  //       .set({ status: 'cancelled' })
  //       .where('id', '=', id)
  //       .executeTakeFirst();

  //     if (query.numUpdatedRows === undefined) {
  //       console.error('Failed to delete participant', query);
  //       return new Error('Failed to delete participant');
  //     }

  //     return;
  //   } catch (error) {
  //     console.error('Error deleting participant:', error);
  //     return new Error('Error deleting participant');
  //   }
  // }
}
