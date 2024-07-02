import { Database, Coaches } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  CoachRepository,
  InsertCoach,
  SelectCoach,
  UpdateCoach,
} from '../coach';

@injectable()
export class KyselyMySqlCoachRepository implements CoachRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('coaches')
      .select(({ fn }) => [fn.count<number>('coaches.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll() {
    return this._db
      .selectFrom('coaches')
      .innerJoin('users', 'coaches.user_id', 'users.id')
      .selectAll('coaches')
      .select('users.name')
      .execute();
  }

  async findByUserId(userId: SelectCoach['user_id']) {
    return this._db
      .selectFrom('coaches')
      .selectAll()
      .where('coaches.user_id', '=', userId)
      .executeTakeFirst();
  }

  findById(id: SelectCoach['id']) {
    return this._db
      .selectFrom('coaches')
      .selectAll()
      .where('coaches.id', '=', id)
      .executeTakeFirst();
  }

  async create(data: InsertCoach) {
    try {
      const query = this._db
        .insertInto('coaches')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create coach', result);
        return new Error('Failed to create coach');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating coach:', error);
      return new Error('Failed to create coach');
    }
  }

  async update(data: UpdateCoach) {
    try {
      const query = await this._db
        .updateTable('coaches')
        .set(data)
        .where('coaches.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update coach', query);
        return new Error('Failed to update coach');
      }

      return;
    } catch (error) {
      console.error('Error updating coach:', error);
      return new Error('Failed to update coach');
    }
  }

  async delete(id: SelectCoach['id']) {
    try {
      const query = await this._db
        .deleteFrom('coaches')
        .where('coaches.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete coach', query);
        return new Error('Failed to delete coach');
      }

      return;
    } catch (error) {
      console.error('Error deleting coach:', error);
      return new Error('Failed to delete coach');
    }
  }
}
