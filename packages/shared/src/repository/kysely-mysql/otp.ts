import { Database, Otp } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { OtpRepository, SelectOtp, UpdateOtp } from '../otp';

@injectable()
export class KyselyMySqlOtpRepository implements OtpRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  findByUserId(userId: SelectOtp['user_id']) {
    return this._db
      .selectFrom('otp')
      .selectAll()
      .where('otp.user_id', '=', userId)
      .executeTakeFirst();
  }

  async create(data: SelectOtp) {
    try {
      const query = this._db
        .insertInto('otp')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create otp', result);
        return new Error('Failed to create otp');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating otp:', error);
      return new Error('Failed to create otp');
    }
  }

  async update(data: UpdateOtp) {
    try {
      const query = await this._db
        .updateTable('otp')
        .set(data)
        .where('otp.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error updating otp:', query);
        return new Error('Failed to update otp');
      }

      return;
    } catch (error) {
      console.error('Error updating otp:', error);
      return new Error('Failed to update otp');
    }
  }

  async deleteByUserId(userId: SelectOtp['user_id']) {
    try {
      const query = await this._db
        .deleteFrom('otp')
        .where('otp.user_id', '=', userId)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Error deleting otp:', query);
        return new Error('Failed to delete otp');
      }

      return;
    } catch (error) {
      console.error('Error deleting otp:', error);
      return new Error('Failed to delete otp');
    }
  }
}
