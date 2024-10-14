import { inject, injectable } from 'inversify';
import {
  AgendaRepository,
  BackFillProps,
  DeleteAgendaCommand,
  DeleteAgendaRecurrenceCommand,
  InsertAgendaBookingCommand,
  InsertAgendaCommand,
  InsertAgendaRecurrenceCommand,
  SelectAgenda,
  SelectAgendaBooking,
  SelectAgendaBookingQuery,
  SelectAgendaQuery,
  SelectAgendaRecurrence,
  SelectAgendaRecurrenceQuery,
  SelectAgendaReturn,
  UpdateAgendaBookingCommand,
  UpdateAgendaCommand,
  UpdateAgendaRecurrenceCommand,
} from '../agenda';
import { Database, DB, db, Users } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { Selectable, SelectQueryBuilder, sql } from 'kysely';
import { QueryResult } from '#dep/types/index';
import { SelectCoach } from '../coach';
import {
  addDays,
  addMinutes,
  endOfDay,
  format,
  getDay,
  startOfDay,
  subDays,
} from 'date-fns';
import { SelectUser } from '../user';
import type { CreditRepository } from '../credit';
import { applyFilters, applyModifiers } from './util';
import {
  AgendaWithAgendaBooking,
  AgendaWithClass,
  AgendaWithCoach,
  AgendaWithLocation,
  AgendaWithParticipant,
} from '#dep/service/agenda';

@injectable()
export class KyselyMySqlAgendaRepository implements AgendaRepository {
  private _db: Database;
  private _creditRepository: CreditRepository;

  constructor(
    @inject(TYPES.Database) db: Database,
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository
  ) {
    this._db = db;
    this._creditRepository = creditRepository;
  }

  async count() {
    const query = await this._db
      .selectFrom('agendas')
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .where('deleted_at', 'is', null)
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async backfillAgenda(backfillProps: BackFillProps) {
    const localDate = format(backfillProps.date, 'yyyy-MM-dd');
    const query = this._db
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
            'agendas.deleted_at',
          ])
          .where(applyFilters(backfillProps.agendaFilter))
      )
      .with('missing_recurrences', (eb) =>
        eb
          .selectFrom('agenda_recurrences')
          .leftJoin(
            'agenda_data',
            'agenda_data.agenda_recurrence_id',
            'agenda_recurrences.id'
          )
          .select([
            sql<null>`null`.as('id'),
            'agenda_recurrences.coach_id',
            'agenda_recurrences.class_id',
            'agenda_recurrences.location_facility_id',
            'agenda_recurrences.id as agenda_recurrence_id',
            sql<Date>`ADDDATE(${localDate}, INTERVAL TIME_TO_SEC(agenda_recurrences.time) / 60 MINUTE)`.as(
              'time'
            ),
            sql<number>`1`.as('is_show'),
            'agenda_recurrences.start_date',
            'agenda_recurrences.end_date',
          ])
          .where(applyFilters(backfillProps.agendaReccurenceFilter))
          .where('agenda_data.id', 'is', null)
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
            'is_show',
          ])
          .unionAll(
            eb
              .selectFrom('missing_recurrences')
              .select([
                'id',
                'coach_id',
                'class_id',
                'location_facility_id',
                'agenda_recurrence_id',
                'time',
                'is_show',
              ])
          )
          .where(applyFilters(backfillProps.agendaFilter))
      )
      .selectFrom('agendas');

    return query;
  }

  async base(data?: SelectAgendaQuery) {
    let baseQuery = this._db.selectFrom('agendas');
    if (data?.withBackfillAgenda) {
      baseQuery = await this.backfillAgenda(data.backfillProps);
    }

    baseQuery = baseQuery
      .$if(
        data?.withCoach === true,
        (qb): QueryResult<AgendaWithCoach> =>
          qb
            .innerJoin('coaches', 'agendas.coach_id', 'coaches.id')
            .innerJoin('users', 'coaches.user_id', 'users.id')
            .$castTo<AgendaWithCoach>()
            .select(['users.name as coach_name', 'coaches.id as coach_id'])
      )
      .$if(
        data?.withClass === true,
        (qb): QueryResult<AgendaWithClass> =>
          qb
            .innerJoin('classes', 'agendas.class_id', 'classes.id')
            .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
            .select([
              'classes.id as class_id',
              'classes.name as class_name',
              'classes.duration as class_duration',
              'classes.slot as class_slot',
              'class_types.id as class_type_id',
              'class_types.type as class_type_name',
            ])
      )
      .$if(
        data?.withLocation === true,
        (qb): QueryResult<AgendaWithLocation> =>
          qb
            .innerJoin(
              'location_facilities',
              'agendas.location_facility_id',
              'location_facilities.id'
            )
            .innerJoin(
              'locations',
              'location_facilities.location_id',
              'locations.id'
            )
            .select([
              'locations.name as location_name',
              'locations.id as location_id',
              'locations.link_maps as location_link_maps',
              'locations.address as location_address',
              'location_facilities.name as location_facility_name',
            ])
      )
      .$if(
        data?.withAgendaBooking === true,
        (qb): QueryResult<AgendaWithAgendaBooking> =>
          qb
            .innerJoin(
              'agenda_bookings',
              'agendas.id',
              'agenda_bookings.agenda_id'
            )
            .select([
              'agenda_bookings.created_at as agenda_booking_updated_at',
              'agenda_bookings.id as agenda_booking_id',
              'agenda_bookings.status as agenda_booking_status',
            ])
      )
      .$if(data?.withParticipant === true, (qb) =>
        qb.select((eb) =>
          eb
            .selectFrom('users')
            .innerJoin('agenda_bookings', 'agenda_bookings.user_id', 'users.id')
            .select(
              sql<
                AgendaWithParticipant[]
              >`coalesce(json_arrayagg(json_object('agenda_booking_id', agenda_bookings.id, 'user_name', users.name,'user_id', users.id, 'agenda_booking_status', agenda_bookings.status)), '[]')`.as(
                'participants'
              )
            )
            .where('agenda_bookings.status', '!=', 'cancelled')
            .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
            .as('participants')
        )
      )
      .$if(data?.withCountParticipant === true, (qb) =>
        qb.select((eb) =>
          eb
            .selectFrom('agenda_bookings')
            .select(sql<number>`count(agenda_bookings.id)`.as('participant'))
            .where('agenda_bookings.status', '=', 'booked')
            .whereRef('agenda_bookings.agenda_id', '=', 'agendas.id')
            .as('participant')
        )
      );

    if (data?.filters) {
      baseQuery = baseQuery.where(
        applyFilters(data.filters, data.customFilters)
      );
    }

    return baseQuery;
  }

  async find<T extends SelectAgenda>(data?: SelectAgendaQuery) {
    let baseQuery = await this.base(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll().execute();
    return result as T[];
  }

  async findWithPagination<T extends SelectAgenda>(data?: SelectAgendaQuery) {
    let baseQuery = await this.base(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [fn.count<number>('agendas.id').as('count')])
      .executeTakeFirst();

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll().execute();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  async baseAgendaBooking(data?: SelectAgendaBookingQuery) {
    let baseQuery = this._db.selectFrom('agenda_bookings');
    if (data?.filters) {
      baseQuery = baseQuery.where(
        applyFilters(data.filters, data.customFilters)
      );
    }

    return baseQuery;
  }

  async findAgendaBooking<T extends SelectAgendaBooking>(
    data?: SelectAgendaBookingQuery
  ) {
    let baseQuery = await this.baseAgendaBooking(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll().execute();
    return result as T[];
  }

  async findAgendaBookingWithPagination<T extends SelectAgendaBooking>(
    data?: SelectAgendaBookingQuery
  ) {
    let baseQuery = await this.baseAgendaBooking(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [fn.count<number>('agenda_bookings.id').as('count')])
      .executeTakeFirst();

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll().execute();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  async baseAgendaRecurrence(data?: SelectAgendaRecurrenceQuery) {
    let baseQuery = this._db.selectFrom('agenda_recurrences');
    baseQuery = baseQuery
      .$if(
        data?.withCoach === true,
        (qb): QueryResult<AgendaWithCoach> =>
          qb
            .innerJoin('coaches', 'agenda_recurrences.coach_id', 'coaches.id')
            .innerJoin('users', 'coaches.user_id', 'users.id')
            .$castTo<AgendaWithCoach>()
            .select(['users.name as coach_name', 'coaches.id as coach_id'])
      )
      .$if(
        data?.withClass === true,
        (qb): QueryResult<AgendaWithClass> =>
          qb
            .innerJoin('classes', 'agenda_recurrences.class_id', 'classes.id')
            .innerJoin('class_types', 'classes.class_type_id', 'class_types.id')
            .select([
              'classes.id as class_id',
              'classes.name as class_name',
              'classes.duration as class_duration',
              'classes.slot as class_slot',
              'class_types.id as class_type_id',
              'class_types.type as class_type_name',
            ])
      )
      .$if(
        data?.withLocation === true,
        (qb): QueryResult<AgendaWithLocation> =>
          qb
            .innerJoin(
              'location_facilities',
              'agenda_recurrences.location_facility_id',
              'location_facilities.id'
            )
            .innerJoin(
              'locations',
              'location_facilities.location_id',
              'locations.id'
            )
            .select([
              'locations.name as location_name',
              'locations.id as location_id',
              'locations.link_maps as location_link_maps',
              'locations.address as location_address',
              'location_facilities.name as location_facility_name',
            ])
      );

    if (data?.filters) {
      baseQuery = baseQuery.where(
        applyFilters(data.filters, data.customFilters)
      );
    }

    return baseQuery;
  }

  async findAgendaRecurrence<T extends SelectAgendaRecurrence>(
    data?: SelectAgendaRecurrenceQuery
  ) {
    let baseQuery = await this.baseAgendaRecurrence(data);
    baseQuery = applyModifiers(baseQuery, data);
    const result = await baseQuery.selectAll().execute();
    return result as T[];
  }

  async findAgendaRecurrenceWithPagination<T extends SelectAgendaRecurrence>(
    data?: SelectAgendaRecurrenceQuery
  ) {
    let baseQuery = await this.baseAgendaRecurrence(data);

    const queryCount = await baseQuery
      .select(({ fn }) => [
        fn.count<number>('agenda_recurrences.id').as('count'),
      ])
      .executeTakeFirst();

    baseQuery = applyModifiers(baseQuery, data);
    const queryData = await baseQuery.selectAll().execute();

    const pageCount = Math.ceil(
      (queryCount?.count ?? 0) / (data?.perPage ?? 10)
    );

    return {
      data: queryData as T[],
      pageCount: pageCount,
    };
  }

  async create({ data, trx }: InsertAgendaCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('agendas')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

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

  async createAgendaBooking({ data, trx }: InsertAgendaBookingCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('agenda_bookings')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);
      if (result.rows[0] === undefined) {
        console.error('Failed to create agenda booking', result);
        return new Error('Failed to create agenda booking');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error creating agenda booking:', error);
      return new Error('Error creating agenda booking');
    }
  }

  async createAgendaRecurrence({ data, trx }: InsertAgendaRecurrenceCommand) {
    try {
      const db = trx ?? this._db;
      const query = db
        .insertInto('agenda_recurrences')
        .values(data)
        .returningAll()
        .compile();

      const result = await db.executeQuery(query);

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

  async update({ data, trx, filters, customFilters }: UpdateAgendaCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('agendas')
        .set(data)
        .where(applyFilters(filters, customFilters))
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

  async updateAgendaRecurrence({
    data,
    trx,
    filters,
    customFilters,
  }: UpdateAgendaRecurrenceCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('agenda_recurrences')
        .set(data)
        .where(applyFilters(filters, customFilters))
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update agenda', query.numUpdatedRows);
        return new Error('Failed to update agenda');
      }

      return;
    } catch (error) {
      console.error('Error updating agenda recurrence:', error);
      return new Error(`Error updating agenda recurrence: ${error}`);
    }
  }

  async updateAgendaBooking({
    data,
    trx,
    filters,
    customFilters,
  }: UpdateAgendaBookingCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('agenda_bookings')
        .set(data)
        .where(applyFilters(filters, customFilters))
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

  async delete({ trx, filters, customFilters }: DeleteAgendaCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .updateTable('agendas')
        .where(applyFilters(filters, customFilters))
        .set({ deleted_at: new Date() })
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to delete agenda', query);
        return new Error('Failed to delete agenda');
      }
      return;
    } catch (error) {
      console.error('Error deleting agenda:', error);
      return new Error('Error deleting agenda');
    }
  }

  async deleteAgendaRecurrence({
    trx,
    filters,
    customFilters,
  }: DeleteAgendaRecurrenceCommand) {
    try {
      const db = trx ?? this._db;
      const query = await db
        .deleteFrom('agenda_recurrences')
        .where(applyFilters(filters, customFilters))
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete agenda', query);
        return new Error('Failed to delete agenda');
      }
      return;
    } catch (error) {
      console.error('Error deleting agenda:', error);
      return new Error('Error deleting agenda');
    }
  }
}
