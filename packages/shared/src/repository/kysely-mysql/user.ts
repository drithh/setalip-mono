import { Database } from '#dep/db/index';
import {
  DeleteCredit,
  FindAllUserOptions,
  InsertCredit,
  InsertUser,
  SelectAmountCredit,
  SelectUser,
  SelectUserWithCredits,
  UpdateUser,
  UserRepository,
} from '#dep/repository/user';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { sql } from 'kysely';

@injectable()
export class KyselyMySqlUserRepository implements UserRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(data: FindAllUserOptions) {
    console.log('findAll', data);
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
      const credits = await this.findCreditsByUserId(user.id);
      userWithCredits.push({ ...user, credits });
    }

    return {
      data: userWithCredits,
      pageCount: pageCount,
    };
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

  async findCreditsByUserId(
    userId: SelectUser['id']
  ): Promise<SelectAmountCredit[]> {
    try {
      const query = await this._db
        .with('ct_debit', (q) =>
          q
            .selectFrom('credit_transactions')
            .selectAll()
            .where('credit_transactions.user_id', '=', userId)
            .where('credit_transactions.expired_at', '>', new Date())
        )
        .with('debit_summary', (q) =>
          q
            .selectFrom('ct_debit')
            .select([
              'ct_debit.class_type_id',
              'ct_debit.amount',
              sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`.as(
                'amount_used'
              ),
            ])
            .leftJoin(
              'credit_transactions',
              'ct_debit.id',
              'credit_transactions.credit_transaction_id'
            )
            .groupBy('ct_debit.id')
            .having(
              'ct_debit.amount',
              '>',
              sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`
            )
        )
        .selectFrom('debit_summary')
        .select([
          'debit_summary.class_type_id',
          sql<number>`SUM((debit_summary.amount - debit_summary.amount_used))`.as(
            'remaining_amount'
          ),
        ])
        .groupBy('debit_summary.class_type_id')
        .execute();

      return query;
    } catch (error) {
      console.error('Error finding credits by user id:', error);
      return [];
    }
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

  async createCredit(data: InsertCredit) {
    try {
      const query = this._db
        .insertInto('credit_transactions')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create credit', result);
        return new Error('Failed to create credit');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating credit:', error);
      return new Error('Failed to create credit');
    }
  }

  async update(data: UpdateUser) {
    try {
      const query = await this._db
        .updateTable('users')
        .set(data)
        .where('users.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Error updating user:', query);
        return new Error('Failed to update user');
      }

      console.log('query', query);
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

  async deleteCredit(data: DeleteCredit) {
    try {
      const credits = await this._db
        .with('ct_debit', (q) =>
          q
            .selectFrom('credit_transactions')
            .selectAll()
            .where('credit_transactions.user_id', '=', data.user_id)
            .where('credit_transactions.expired_at', '>', new Date())
            .where('credit_transactions.class_type_id', '=', data.class_type_id)
        )
        .with('debit_summary', (q) =>
          q
            .selectFrom('ct_debit')
            .select([
              'ct_debit.id',
              'ct_debit.class_type_id',
              'ct_debit.amount',
              sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`.as(
                'amount_used'
              ),
            ])
            .leftJoin(
              'credit_transactions',
              'ct_debit.id',
              'credit_transactions.credit_transaction_id'
            )
            .groupBy('ct_debit.id')
            .having(
              'ct_debit.amount',
              '>',
              sql<number>`COALESCE(SUM(credit_transactions.amount), 0)`
            )
        )
        .selectFrom('debit_summary')
        .selectAll()
        .execute();

      const creditSum = credits.reduce(
        (acc, curr) => acc + (curr.amount - curr.amount_used),
        0
      );

      if (data.amount > creditSum) {
        console.log('Insufficient credit:', data.amount, creditSum);
        return new Error('Insufficient credit');
      }

      let currentAmount = data.amount;
      await this._db.transaction().execute(async (trx) => {
        for (const credit of credits) {
          if (currentAmount <= 0) {
            continue;
          }

          const reducedAmount = Math.min(
            currentAmount,
            credit.amount - credit.amount_used
          );

          const query = trx
            .insertInto('credit_transactions')
            .values({
              user_id: data.user_id,
              credit_transaction_id: credit.id,
              class_type_id: data.class_type_id,
              amount: reducedAmount,
              type: 'credit' as const,
              note: data.note,
            })
            .returningAll()
            .compile();

          const result = await trx.executeQuery(query);

          if (result.rows[0] === undefined) {
            console.error('Error deleting credit:', query);
            return new Error('Failed to delete credit');
          }

          currentAmount -= reducedAmount;
        }
      });

      return;
    } catch (error) {
      console.error('Error deleting credit:', error);
      return new Error('Failed to delete credit');
    }
  }
}
