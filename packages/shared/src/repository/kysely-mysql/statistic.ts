import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { injectable, inject } from 'inversify';
import { LocationRepository } from '../location';
import {
  StatisticRepository,
  InsertStatistic,
  SelectStatistic,
  UpdateStatistic,
  FindAllStatisticOption,
  SelectUser,
} from '..';

@injectable()
export class KyselyMySqlStatisticRepository implements StatisticRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('statistics')
      .select(({ fn }) => [fn.count<number>('statistics.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll(data: FindAllStatisticOption) {
    const { page = 1, perPage = 10, sort, role } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectStatistic} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('statistics');

    if (role && role.length > 0) {
      query = query.where('statistics.role', 'in', role);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('statistics.id').as('count')])
      .executeTakeFirst();

    return {
      data: queryData,
      pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
    };
  }

  async findById(id: SelectStatistic['id']) {
    return this._db
      .selectFrom('statistics')
      .selectAll()
      .where('statistics.id', '=', id)
      .executeTakeFirst();
  }

  async findByUser(user_id: SelectUser['id']) {
    const user = await this._db
      .selectFrom('users')
      .selectAll()
      .executeTakeFirst();

    if (user === undefined || user.role === 'admin' || user.role === 'owner') {
      return {
        statistic: [],
        participation: 0,
      };
    }

    const participation = await this._db
      .selectFrom('agenda_bookings')
      .select(({ fn }) => [fn.count('agenda_bookings.id').as('participation')])
      .where('agenda_bookings.user_id', '=', user_id)
      .where('agenda_bookings.status', '=', 'checked_in')
      .executeTakeFirst();

    const statistic = await this._db
      .selectFrom('statistics')
      .selectAll()
      .where('statistics.role', '=', user.role)
      .execute();

    return {
      statistic,
      participation:
        typeof participation?.participation === 'number'
          ? participation.participation
          : 0,
    };
  }

  async create(data: InsertStatistic) {
    try {
      const query = this._db
        .insertInto('statistics')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create stastistic', result);
        return new Error('Failed to create stastistic');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating stastistic:', error);
      return new Error('Failed to create stastistic');
    }
  }

  async update(data: UpdateStatistic) {
    try {
      const query = await this._db
        .updateTable('statistics')
        .set(data)
        .where('statistics.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update stastistic', query);
        return new Error('Failed to update stastistic');
      }

      return;
    } catch (error) {
      console.error('Error updating stastistic:', error);
      return new Error('Failed to update stastistic');
    }
  }

  async delete(id: SelectStatistic['id']) {
    try {
      const query = this._db
        .deleteFrom('statistics')
        .where('statistics.id', '=', id)
        .execute();

      return;
    } catch (error) {
      console.error('Error deleting stastistic:', error);
      return new Error('Failed to delete stastistic');
    }
  }
}
