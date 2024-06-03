import { inject, injectable } from 'inversify';
import {
  FindAllAgendaOptions,
  InsertAgenda,
  AgendaRepository,
  SelectAgenda,
  UpdateAgenda,
  InsertAgendaBooking,
  SelectAgendaBooking,
} from '../agenda';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';

@injectable()
export class KyselyMySqlAgendaRepository implements AgendaRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(data: FindAllAgendaOptions) {
    const {
      page = 1,
      perPage = 10,
      sort,
      coach,
      className,
      dateStart,
      dateEnd,
      locations,
    } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
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
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('agenda_bookings')
            .innerJoin('users', 'agenda_bookings.user_id', 'users.id')
            .select(['agenda_bookings.id', 'users.name'])
            .where('agenda_bookings.status', '!=', 'cancelled')
            .whereRef('classes.id', '=', 'agendas.class_id')
        ).as('participants'),
      ]);

    if (className) {
      query = query.where('classes.name', 'like', `%${className}%`);
    }

    if (dateStart && dateEnd) {
      query = query
        .where('agendas.time', '>=', dateStart)
        .where('agendas.time', '<=', dateEnd);
    }

    if (coach) {
      query = query.where('users.name', 'like', `%${coach}%`);
    }

    if (locations) {
      query = query.where('locations.id', 'in', locations);
    }

    const queryData = await query
      .selectAll('agendas')
      .select([
        'users.name as coach_name',
        'classes.name as class_name',
        'classes.duration as class_duration',
        'location_facilities.capacity as location_capacity',
        'locations.name as location_name',
        'locations.id as location_id',
      ])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('id').as('count')])
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

  async create(data: InsertAgenda) {
    try {
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

  async createParticipant(data: InsertAgendaBooking) {
    try {
      const query = this._db
        .insertInto('agenda_bookings')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create participant', result);
        return new Error('Failed to create participant');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating participant:', error);
      return new Error('Error creating participant');
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

  async delete(id: SelectAgenda['id']) {
    try {
      const query = await this._db
        .deleteFrom('agendas')
        .where('id', '=', id)
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

  async deleteParticipant(id: SelectAgendaBooking['id']) {
    try {
      const query = await this._db
        .updateTable('agenda_bookings')
        .set({ status: 'cancelled' })
        .where('id', '=', id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to delete participant', query);
        return new Error('Failed to delete participant');
      }

      return;
    } catch (error) {
      console.error('Error deleting participant:', error);
      return new Error('Error deleting participant');
    }
  }
}
