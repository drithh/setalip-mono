import { Database, CreditTransactions } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  CreditRepository,
  DeleteCredit,
  FindAllCreditOptions,
  InsertCredit,
  SelectAmountCredit,
  SelectCredit,
  UpdateCredit,
} from '../credit';
import { sql } from 'kysely';
import { SelectUser } from '../user';

@injectable()
export class KyselyMySqlCreditRepository implements CreditRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll() {
    return this._db
      .selectFrom('credit_transactions')
      .selectAll('credit_transactions')
      .execute();
  }

  async findAmountByUserId(
    userId: SelectUser['id']
  ): Promise<SelectAmountCredit[]> {
    try {
      const query = await this._db
        .with('ct_debit', (q) =>
          q
            .selectFrom('credit_transactions')
            .innerJoin(
              'class_types',
              'credit_transactions.class_type_id',
              'class_types.id'
            )
            .selectAll('credit_transactions')
            .select('class_types.type as class_type_name')
            .where('credit_transactions.user_id', '=', userId)
            .where('credit_transactions.expired_at', '>', new Date())
        )
        .with('debit_summary', (q) =>
          q
            .selectFrom('ct_debit')
            .select([
              'ct_debit.class_type_id',
              'ct_debit.class_type_name',
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
          'debit_summary.class_type_name',
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

  findById(id: SelectCredit['id']) {
    return this._db
      .selectFrom('credit_transactions')
      .selectAll()
      .where('credit_transactions.id', '=', id)
      .executeTakeFirst();
  }

  async findAllByUserId(data: FindAllCreditOptions) {
    const { page = 1, perPage = 10, sort, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectCredit} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('credit_transactions');

    if (types) {
      query = query.where('credit_transactions.type', 'in', types);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('credit_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    return {
      data: queryData,
      pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
    };
  }

  async create(data: InsertCredit) {
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

  async update(data: UpdateCredit) {
    try {
      const query = await this._db
        .updateTable('credit_transactions')
        .set(data)
        .where('credit_transactions.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update credit', query);
        return new Error('Failed to update credit');
      }

      return;
    } catch (error) {
      console.error('Error updating credit:', error);
      return new Error('Failed to update credit');
    }
  }

  async delete(data: DeleteCredit) {
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
