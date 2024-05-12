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

  findUserById(id: UserID) {
    return this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.id', '=', id)
      .executeTakeFirstOrThrow();
  }

  findUserByEmail(email: UserEmail) {
    return this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.email', '=', email)
      .executeTakeFirstOrThrow();
  }

  getUsers() {
    return this._db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .execute();
  }

  createUser(data: CreateUser) {
    const insertedData = this._db
      .insertInto('users')
      .values(data)
      .executeTakeFirstOrThrow();
    return insertedData;
  }

  updateUser(data: UpdateUser) {
    const updatedData = this._db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', data.id)
      .returning(['email', 'id', 'hashed_password'])
      .executeTakeFirstOrThrow();

    return updatedData;
  }

  deleteUser(data: DeleteUser) {
    return this._db
      .deleteFrom('users')
      .where('users.id', '=', data)
      .executeTakeFirstOrThrow();
  }
}
