import { Database } from '#dep/db/index';
import {
  InsertUser,
  SelectUser,
  UpdateUser,
  UserRepository,
} from '#dep/repository/user';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';

@injectable()
export class KyselyMySqlUserRepository implements UserRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  findUserById(id: SelectUser['id']) {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.id', '=', id)
      .executeTakeFirst();
  }

  findUserByEmail(email: SelectUser['email']) {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.email', '=', email)
      .executeTakeFirst();
  }

  getUsers() {
    return this._db.selectFrom('users').selectAll().execute();
  }

  createUser(data: InsertUser) {
    const insertedData = this._db
      .insertInto('users')
      .values(data)
      .executeTakeFirstOrThrow();
    return insertedData;
  }

  async updateUser(data: UpdateUser) {
    await this._db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', data.id)
      .executeTakeFirstOrThrow();

    return data;
  }

  deleteUser(data: SelectUser['id']) {
    return this._db
      .deleteFrom('users')
      .where('users.id', '=', data)
      .executeTakeFirstOrThrow();
  }
}
