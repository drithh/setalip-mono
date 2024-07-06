import { Database, LoyaltyTransactions } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  LoyaltyRepository,
  DeleteLoyalty,
  FindAllLoyaltyOptions,
  InsertLoyalty,
  SelectLoyalty,
  UpdateLoyalty,
} from '../loyalty';
import { sql } from 'kysely';
import { SelectUser } from '../user';

@injectable()
export class KyselyMySqlLoyaltyRepository implements LoyaltyRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('loyalty_rewards')
      .select(({ fn }) => [fn.count<number>('loyalty_rewards.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll() {
    return this._db
      .selectFrom('loyalty_transactions')
      .selectAll('loyalty_transactions')
      .execute();
  }

  findById(id: SelectLoyalty['id']) {
    return this._db
      .selectFrom('loyalty_transactions')
      .selectAll()
      .where('loyalty_transactions.id', '=', id)
      .executeTakeFirst();
  }

  async findAmountByUserId(userId: SelectUser['id']) {
    const query = await this._db
      .selectFrom('loyalty_transactions')
      .select([
        'user_id',
        sql<number>`SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END)`.as(
          'total_credit'
        ),
        sql<number>`SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END)`.as(
          'total_debit'
        ),
      ])
      .where('loyalty_transactions.user_id', '=', userId)
      .groupBy('user_id')
      .executeTakeFirst();

    return query;
  }

  async findAllByUserId(data: FindAllLoyaltyOptions) {
    const { page = 1, perPage = 10, sort, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectLoyalty} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('loyalty_transactions')
      .where('loyalty_transactions.user_id', '=', data.user_id);

    if (types) {
      query = query.where('loyalty_transactions.type', 'in', types);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('loyalty_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    return {
      data: queryData,
      pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
    };
  }

  async create(data: InsertLoyalty) {
    try {
      const query = this._db
        .insertInto('loyalty_transactions')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create loyalty', result);
        return new Error('Failed to create loyalty');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating loyalty:', error);
      return new Error('Failed to create loyalty');
    }
  }

  async update(data: UpdateLoyalty) {
    try {
      const query = await this._db
        .updateTable('loyalty_transactions')
        .set(data)
        .where('loyalty_transactions.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update loyalty', query);
        return new Error('Failed to update loyalty');
      }

      return;
    } catch (error) {
      console.error('Error updating loyalty:', error);
      return new Error('Failed to update loyalty');
    }
  }

  async delete(data: DeleteLoyalty) {
    try {
      const loyaltys = await this._db
        .with('transactions', (q) =>
          q
            .selectFrom('loyalty_transactions')
            .select([
              'user_id',
              'type',
              sql<number>`SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END)`.as(
                'total_credit'
              ),
              sql<number>`SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END)`.as(
                'total_debit'
              ),
            ])
            .where('loyalty_transactions.user_id', '=', data.user_id)
            .groupBy(['user_id', 'type'])
        )
        .with('summary', (q) =>
          q
            .selectFrom('transactions')
            .select([
              'user_id',
              sql<number>`MAX(total_debit)`.as('amount'),
              sql<number>`MAX(total_credit)`.as('amount_used'),
            ])
            .groupBy('transactions.user_id')
        )
        .selectFrom('summary')
        .selectAll()
        .execute();

      const loyaltySum = loyaltys.reduce(
        (acc, curr) => acc + (curr.amount - curr.amount_used),
        0
      );

      if (data.amount > loyaltySum) {
        console.error('Insufficient loyalty:', data.amount, loyaltySum);
        return new Error('Insufficient loyalty');
      }

      let currentAmount = data.amount;
      await this._db.transaction().execute(async (trx) => {
        for (const loyalty of loyaltys) {
          if (currentAmount <= 0) {
            continue;
          }

          const reducedAmount = Math.min(
            currentAmount,
            loyalty.amount - loyalty.amount_used
          );

          const query = trx
            .insertInto('loyalty_transactions')
            .values({
              user_id: data.user_id,
              amount: reducedAmount,
              type: 'credit' as const,
              note: data.note,
            })
            .returningAll()
            .compile();

          const result = await trx.executeQuery(query);

          if (result.rows[0] === undefined) {
            console.error('Error deleting loyalty:', query);
            return new Error('Failed to delete loyalty');
          }

          currentAmount -= reducedAmount;
        }
      });

      return;
    } catch (error) {
      console.error('Error deleting loyalty:', error);
      return new Error('Failed to delete loyalty');
    }
  }
}
