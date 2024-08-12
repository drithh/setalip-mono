import { Database } from '#dep/db/index';
import {
  FindAllUserOptions,
  InsertUser,
  SelectUser,
  SelectUserWithCredits,
  UpdateUser,
  UserRepository,
} from '#dep/repository/user';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { sql } from 'kysely';
import type { CreditRepository } from '../credit';

@injectable()
export class KyselyMySqlUserRepository implements UserRepository {
  private _db: Database;
  private _creditRepository: CreditRepository;

  constructor(
    @inject(TYPES.Database) db: Database,
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository
  ) {
    this._db = db;
    this._creditRepository = creditRepository;
  }

  async count() {
    const query = await this._db
      .selectFrom('users')
      .select(({ fn }) => [fn.count<number>('users.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll(data: FindAllUserOptions) {
    const { page = 1, perPage = 10, sort, name, roles } = data || {};

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectUser} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('users');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    if (roles) {
      query = query.where('role', 'in', roles);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    // iterate over queryData and fetch credits for each user
    const userWithCredits: SelectUserWithCredits[] = [];
    for (const user of queryData) {
      const credits = await this._creditRepository.findAmountByUserId(user.id);
      userWithCredits.push({ ...user, credits });
    }

    return {
      data: userWithCredits,
      pageCount: pageCount,
    };
  }

  async findAllUserName() {
    return this._db.selectFrom('users').select(['name', 'id']).execute();
  }

  findAllUserBirthday() {
    // find all users with birthday today
    return this._db
      .selectFrom('users')
      .selectAll()
      .where(sql<boolean>`MONTH(users.date_of_birth) = MONTH(CURDATE())`)
      .where(sql<boolean>`DAY(users.date_of_birth) = DAY(CURDATE())`)
      .where('users.role', '=', 'user')
      .execute();
  }

  async findAllMember() {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.role', '=', 'user')
      .execute();
  }

  async findById(id: SelectUser['id']): Promise<SelectUser | undefined> {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.id', '=', id)
      .executeTakeFirst();
  }

  async findByPhoneNumber(
    phoneNumber: SelectUser['phone_number']
  ): Promise<SelectUser | undefined> {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.phone_number', '=', phoneNumber)
      .executeTakeFirst();
  }

  async findByEmail(
    email: SelectUser['email']
  ): Promise<SelectUser | undefined> {
    return this._db
      .selectFrom('users')
      .selectAll()
      .where('users.email', '=', email)
      .executeTakeFirst();
  }

  async create(data: InsertUser) {
    try {
      const query = this._db
        .insertInto('users')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create user', result);
        return new Error('Failed to create user');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      return new Error('Failed to create user');
    }
  }

  async update(data: UpdateUser) {
    try {
      const transaction = await this._db.transaction().execute(async (trx) => {
        const currentUser = await trx
          .selectFrom('users')
          .selectAll()
          .where('users.id', '=', data.id)
          .executeTakeFirst();

        const query = await trx
          .updateTable('users')
          .set(data)
          .where('users.id', '=', data.id)
          .executeTakeFirst();

        if (query.numUpdatedRows === undefined) {
          console.error('Error updating user:', query);
          return new Error('Failed to update user');
        }

        if (currentUser?.role !== data.role) {
          // from user to coach
          if (currentUser?.role === 'user' && data.role === 'coach') {
            const query = trx
              .insertInto('coaches')
              .values({ user_id: data.id })
              .compile();

            const result = await trx.executeQuery(query);

            if (result.rows[0] === undefined) {
              console.error('Failed to create coach', result);
              return new Error('Failed to create coach');
            }

            return;
          } else if (currentUser?.role === 'coach' && data.role === 'user') {
            const query = await trx
              .updateTable('coaches')
              .set({ user_id: null })
              .where('user_id', '=', data.id)
              .executeTakeFirst();

            if (query.numUpdatedRows === undefined) {
              console.error('Failed to delete coach', query);
              return new Error('Failed to delete coach');
            }

            return;
          }
        }

        return;
      });

      return;
    } catch (error) {
      console.error('Error updating user:', error);
      return new Error('Failed to update user');
    }
  }

  async delete(id: SelectUser['id']) {
    try {
      const query = await this._db
        .deleteFrom('users')
        .where('users.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Error deleting user:', query);
        return new Error('Failed to delete user');
      }

      return;
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Error('Failed to delete user');
    }
  }
}
