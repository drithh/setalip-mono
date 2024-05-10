import { Database } from '#dep/db/index';
import { UserRepository } from '#dep/repository/user';
import {
  CreateUser,
  DeleteUser,
  UpdateUser,
  UserEmail,
  UserID,
} from '#dep/schema/index';
import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';

@injectable()
export class KyselyMySqlUserRepository implements UserRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async FindUserById(id: UserID) {
    return this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async FindUserByEmail(email: UserEmail) {
    return this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.email', '=', email)
      .executeTakeFirstOrThrow();
  }

  async GetUsers() {
    console.log('GetUsers', this._db);
    return await this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .execute();
  }

  async CreateUser(data: CreateUser) {
    const insertedData = this._db
      .insertInto('users')
      .values(data)
      .executeTakeFirstOrThrow();
    return insertedData;
  }

  async UpdateUser(data: UpdateUser) {
    const updatedData = this._db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', data.id)
      .returning(['email', 'id', 'hashed_password'])
      .executeTakeFirstOrThrow();

    return updatedData;
  }

  DeleteUser(data: DeleteUser) {
    return this._db
      .deleteFrom('users')
      .where('users.id', '=', data)
      .executeTakeFirstOrThrow();
  }
}
