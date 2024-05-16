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

  findResetPasswordByUserId(userId: SelectResetPassword['user_id']) {
    return this._db
      .selectFrom('reset_password')
      .selectAll()
      .where('reset_password.user_id', '=', userId)
      .executeTakeFirst();
  }

  findResetPasswordByToken(token: SelectResetPassword['token']) {
    return this._db
      .selectFrom('reset_password')
      .selectAll()
      .where('reset_password.token', '=', token)
      .executeTakeFirst();
  }

  createResetPassword(data: InsertResetPassword) {
    return this._db
      .insertInto('reset_password')
      .values(data)
      .executeTakeFirst();
  }
  updateResetPassword(data: UpdateResetPassword) {
    return this._db
      .updateTable('reset_password')
      .set(data)
      .where('reset_password.id', '=', data.id)
      .executeTakeFirst();
  }
  deleteResetPassword(data: SelectResetPassword['id']) {
    return this._db
      .deleteFrom('reset_password')
      .where('reset_password.id', '=', data)
      .executeTakeFirst();
  }
  deleteResetPasswordByUserId(data: SelectResetPassword['user_id']) {
    return this._db
      .deleteFrom('reset_password')
      .where('reset_password.user_id', '=', data)
      .executeTakeFirst();
  }
}
