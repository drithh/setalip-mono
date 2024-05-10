'use server';
import { UserRepository } from '#deps/repository/user';
import {
  CreateUser,
  Database,
  DeleteUser,
  UpdateUser,
  UserEmail,
  UserID,
} from '#deps/schema/index';
import { Kysely } from 'kysely';

export async function newUserRepository(
  db: Kysely<Database>
): Promise<KyselyMySqlUserRepository> {
  return new KyselyMySqlUserRepository(db);
}

class KyselyMySqlUserRepository implements UserRepository {
  private readonly db: Kysely<Database>;
  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  FindUserById(id: UserID) {
    return this.db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.id', '=', id)
      .executeTakeFirstOrThrow();
  }

  FindUserByEmail(email: UserEmail) {
    return this.db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .where('users.email', '=', email)
      .executeTakeFirst();
  }

  GetUsers() {
    return this.db
      .selectFrom('users')
      .select(['id', 'email', 'hashed_password'])
      .execute();
  }

  CreateUser(data: CreateUser) {
    const insertedData = this.db
      .insertInto('users')
      .values(data)
      .executeTakeFirstOrThrow();
    return insertedData;
  }

  UpdateUser(data: UpdateUser) {
    const updatedData = this.db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', data.id)
      .returning(['email', 'id', 'hashed_password'])
      .executeTakeFirstOrThrow();

    return updatedData;
  }

  DeleteUser(data: DeleteUser) {
    return this.db
      .deleteFrom('users')
      .where('users.id', '=', data)
      .executeTakeFirstOrThrow();
  }
}
