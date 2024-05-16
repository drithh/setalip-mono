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

  findOtpByUserId(userId: SelectOtp['user_id']) {
    return this._db
      .selectFrom('otp')
      .selectAll()
      .where('otp.user_id', '=', userId)
      .executeTakeFirst();
  }

  createOtp(data: SelectOtp) {
    return this._db.insertInto('otp').values(data).executeTakeFirst();
  }

  async updateOtp(data: UpdateOtp) {
    return await this._db
      .updateTable('otp')
      .set(data)
      .where('otp.id', '=', data.id)
      .executeTakeFirst();
  }

  async deleteOtp(id: SelectOtp['id']) {
    return this._db
      .deleteFrom('otp')
      .where('otp.id', '=', id)
      .executeTakeFirst();
  }

  async deleteOtpByUserId(userId: SelectOtp['user_id']) {
    return this._db
      .deleteFrom('otp')
      .where('otp.user_id', '=', userId)
      .executeTakeFirst();
  }
}
