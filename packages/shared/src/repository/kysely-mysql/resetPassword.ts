import { inject, injectable } from 'inversify';
import {
  InsertResetPassword,
  ResetPasswordRepository,
  SelectResetPassword,
  UpdateResetPassword,
} from '../resetPassword';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';

@injectable()
export class KyselyMySqlResetPasswordRepository
  implements ResetPasswordRepository
{
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  findByUserId(userId: SelectResetPassword['user_id']) {
    return this._db
      .selectFrom('reset_password')
      .selectAll()
      .where('reset_password.user_id', '=', userId)
      .executeTakeFirst();
  }

  findByToken(token: SelectResetPassword['token']) {
    return this._db
      .selectFrom('reset_password')
      .selectAll()
      .where('reset_password.token', '=', token)
      .executeTakeFirst();
  }

  async create(data: InsertResetPassword) {
    try {
      const query = this._db
        .insertInto('reset_password')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create reset_password', result);
        return new Error('Failed to create reset_password');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating reset_password:', error);
      return new Error('Failed to create reset_password');
    }
  }

  async update(data: UpdateResetPassword) {
    try {
      const query = await this._db
        .updateTable('reset_password')
        .set(data)
        .where('reset_password.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error updating reset_password:', query);
        return new Error('Failed to update reset_password');
      }

      return;
    } catch (error) {
      console.error('Error updating reset_password:', error);
      return new Error('Failed to update reset_password');
    }
  }

  async delete(data: SelectResetPassword['id']) {
    try {
      const query = await this._db
        .deleteFrom('reset_password')
        .where('reset_password.id', '=', data)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Error deleting reset_password:', query);
        return new Error('Failed to delete reset_password');
      }

      return;
    } catch (error) {
      console.error('Error deleting reset_password:', error);
      return new Error('Failed to delete reset_password');
    }
  }

  async deleteByUserId(userId: SelectResetPassword['user_id']) {
    try {
      const query = await this._db
        .deleteFrom('reset_password')
        .where('reset_password.user_id', '=', userId)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Error deleting reset_password:', query);
        return new Error('Failed to delete reset_password');
      }

      return;
    } catch (error) {
      console.error('Error deleting reset_password:', error);
      return new Error('Failed to delete reset_password');
    }
  }
}
