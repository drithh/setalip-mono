import { Database, LoyaltyTransactions } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  LoyaltyRepository,
  DeleteLoyalty,
  FindAllLoyaltyByUserIdOptions,
  InsertLoyalty,
  SelectLoyalty,
  UpdateLoyalty,
  FindAllLoyaltyOptions,
  FindAllLoyaltyRewardOptions,
  SelectAllLoyaltyReward,
  SelectLoyaltyReward,
  FindAllLoyaltyShopOptions,
  SelectAllLoyaltyShop,
  SelectLoyaltyShop,
  InsertLoyaltyReward,
  InsertLoyaltyShop,
  UpdateLoyaltyReward,
  InsertLoyaltyOnReward,
  UpdateLoyaltyShop,
  InsertLoyaltyFromShop,
} from '../loyalty';
import { sql } from 'kysely';
import { SelectUser } from '../user';
import type { PackageRepository } from '../package';
import { addDays } from 'date-fns';

@injectable()
export class KyselyMySqlLoyaltyRepository implements LoyaltyRepository {
  private _db: Database;
  private _packageRepository: PackageRepository;

  constructor(
    @inject(TYPES.Database) db: Database,
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository
  ) {
    this._db = db;
    this._packageRepository = packageRepository;
  }

  async count() {
    const query = await this._db
      .selectFrom('loyalty_rewards')
      .select(({ fn }) => [fn.count<number>('loyalty_rewards.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll(data: FindAllLoyaltyOptions) {
    const { page = 1, perPage = 10, sort, types, user_name } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectLoyalty} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('loyalty_transactions')
      .innerJoin('users', 'loyalty_transactions.user_id', 'users.id');

    if (user_name) {
      query = query.where('users.name', 'like', `%${user_name}%`);
    }

    if (types) {
      query = query.where('loyalty_transactions.type', 'in', types);
    }

    const queryData = await query
      .selectAll(['loyalty_transactions'])
      .select(['users.name as user_name', 'users.email as user_email'])
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

  async findAllReward(data: FindAllLoyaltyRewardOptions) {
    const { page = 1, perPage = 10, sort, name } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectLoyaltyReward} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('loyalty_rewards');

    if (name) {
      query = query.where('loyalty_rewards.name', 'like', `%${name}%`);
    }

    if (data.is_active) {
      query = query.where('loyalty_rewards.is_active', '=', data.is_active);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('loyalty_rewards.id').as('count')])
      .executeTakeFirst();

    return {
      data: queryData,
      pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
    };
  }

  async findAllShop(data: FindAllLoyaltyShopOptions) {
    const { page = 1, perPage = 10, sort, name } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectLoyaltyShop} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('loyalty_shops')
      .leftJoin('packages', 'loyalty_shops.package_id', 'packages.id');

    if (name) {
      query = query.where('loyalty_shops.name', 'like', `%${name}%`);
    }

    const queryData = await query
      .selectAll('loyalty_shops')
      .select(['packages.name as package_name'])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('loyalty_shops.id').as('count')])
      .executeTakeFirst();

    return {
      data: queryData,
      pageCount: Math.ceil((queryCount?.count ?? 0) / perPage),
    };
  }

  async findAllByUserId(data: FindAllLoyaltyByUserIdOptions) {
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

  findByRewardIdAndUserId(
    rewardId: SelectLoyalty['loyalty_reward_id'],
    userId: SelectLoyalty['user_id']
  ): Promise<SelectLoyalty | undefined> {
    return this._db
      .selectFrom('loyalty_transactions')
      .selectAll()
      .where('loyalty_transactions.loyalty_reward_id', '=', rewardId)
      .where('loyalty_transactions.user_id', '=', userId)
      .executeTakeFirst();
  }

  findByRewardIdAndReferenceId(
    rewardId: SelectLoyalty['loyalty_reward_id'],
    referenceId: SelectLoyalty['reference_id']
  ) {
    return this._db
      .selectFrom('loyalty_transactions')
      .selectAll()
      .where('loyalty_transactions.loyalty_reward_id', '=', rewardId)
      .where('loyalty_transactions.reference_id', '=', referenceId)
      .executeTakeFirst();
  }

  async findRewardById(
    id: SelectLoyaltyReward['id']
  ): Promise<SelectLoyaltyReward | undefined> {
    return this._db
      .selectFrom('loyalty_rewards')
      .selectAll()
      .where('loyalty_rewards.id', '=', id)
      .executeTakeFirst();
  }

  async findRewardByName(
    name: SelectLoyaltyReward['name']
  ): Promise<SelectLoyaltyReward | undefined> {
    return this._db
      .selectFrom('loyalty_rewards')
      .selectAll()
      .where('loyalty_rewards.name', '=', name)
      .executeTakeFirst();
  }

  async findShopById(
    id: SelectLoyaltyShop['id']
  ): Promise<SelectLoyaltyShop | undefined> {
    return this._db
      .selectFrom('loyalty_shops')
      .selectAll()
      .where('loyalty_shops.id', '=', id)
      .executeTakeFirst();
  }

  async findShopByName(
    name: SelectLoyaltyShop['name']
  ): Promise<SelectLoyaltyShop | undefined> {
    return this._db
      .selectFrom('loyalty_shops')
      .selectAll()
      .where('loyalty_shops.name', '=', name)
      .executeTakeFirst();
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

  async create(data: InsertLoyalty) {
    try {
      const query = this._db
        .insertInto('loyalty_transactions')
        .values({
          ...data,
          type: 'debit' as const,
        })
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

  async createFromShop(
    data: InsertLoyaltyFromShop
  ): Promise<SelectLoyalty | Error> {
    try {
      const result = await this._db.transaction().execute(async (trx) => {
        const shop = await this.findShopById(data.shop_id);

        if (shop === undefined) {
          console.error('Shop not found:', data.shop_id);
          return new Error('Shop not found');
        }

        const userCredit = await this.findAmountByUserId(data.user_id);

        if (userCredit === undefined) {
          console.error('User not found:', data.user_id);
          return new Error('User not found');
        }

        const currentCredit = userCredit.total_debit - userCredit.total_credit;
        if (currentCredit < (shop.price ?? 0)) {
          console.error('Insufficient loyalty:', currentCredit, shop.price);
          return new Error(`Insufficient loyalty, user has ${currentCredit}`);
        }

        if (shop.type === 'package') {
          if (shop.package_id === null) {
            console.error('Package not found:', shop.package_id);
            return new Error('Package not found');
          }

          const singlePackage = (
            await this._packageRepository.find({
              filters: { id: shop.package_id },
            })
          )?.[0];

          if (singlePackage === undefined) {
            console.error('Package not found:', shop.package_id);
            return new Error('Package not found');
          }

          const expiredAt = addDays(new Date(), singlePackage.valid_for);

          const userPackage = trx
            .insertInto('user_packages')
            .values({
              note: `Purchase package ${singlePackage.name} with loyalty points`,
              user_id: data.user_id,
              package_id: singlePackage.id,
              expired_at: expiredAt,
              credit: singlePackage.credit,
            })
            .returningAll()
            .compile();

          const resultUserPackage = await trx.executeQuery(userPackage);

          if (resultUserPackage.rows[0] === undefined) {
            console.error('Failed to create user package', resultUserPackage);
            return new Error('Failed to create user package');
          }

          const userPackageId = resultUserPackage.rows[0].id;

          // const creditTransaction = await trx
          //   .insertInto('credit_transactions')
          //   .values({
          //     user_package_id: userPackageId,
          //     expired_at: expiredAt,
          //     note: `Purchase package ${singlePackage.name} with loyalty points`,
          //     class_type_id: singlePackage.class_type_id,
          //     user_id: data.user_id,
          //     amount: singlePackage.credit,
          //     type: 'debit',
          //   })
          //   .returningAll()
          //   .compile();

          // const resultCreditTransaction =
          //   await trx.executeQuery(creditTransaction);

          // if (resultCreditTransaction.rows[0] === undefined) {
          //   console.error(
          //     'Failed to create credit transaction',
          //     resultCreditTransaction
          //   );
          //   return new Error('Failed to create credit transaction');
          // }

          const query = this._db
            .insertInto('loyalty_transactions')
            .values({
              user_id: data.user_id,
              amount: shop.price ?? 0,
              type: 'credit' as const,
              loyalty_shop_id: data.shop_id,
              note: `You have purchased ${shop.name}`,
            })
            .returningAll()
            .compile();

          const result = await this._db.executeQuery(query);

          if (result.rows[0] === undefined) {
            console.error('Failed to create loyalty', result);
            return new Error('Failed to create loyalty');
          }

          return result.rows[0];
        }

        const query = this._db
          .insertInto('loyalty_transactions')
          .values({
            user_id: data.user_id,
            amount: shop.price ?? 0,
            type: 'credit' as const,
            loyalty_shop_id: data.shop_id,
            note: `You have purchased ${shop.name}`,
          })
          .returningAll()
          .compile();

        const result = await this._db.executeQuery(query);

        if (result.rows[0] === undefined) {
          console.error('Failed to create loyalty', result);
          return new Error('Failed to create loyalty');
        }

        return result.rows[0];
      });

      return result;
    } catch (error) {
      console.error('Error creating loyalty:', error);
      return new Error('Failed to create loyalty');
    }
  }

  async createOnReward(data: InsertLoyaltyOnReward) {
    try {
      const reward = await this.findRewardById(data.reward_id);

      if (reward === undefined) {
        console.error('Reward not found:', data.reward_id);
        return new Error('Reward not found');
      }

      if (!reward.is_active) {
        console.error('Reward is not active:', reward);
        return undefined;
      }

      const query = this._db
        .insertInto('loyalty_transactions')
        .values({
          user_id: data.user_id,
          amount: reward.credit,
          type: 'debit' as const,
          note: data.note,
          loyalty_reward_id: data.reward_id,
          reference_id: data.reference_id,
        })
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create loyalty', result);
        return new Error('Failed to create loyalty');
      }

      return undefined;
    } catch (error) {
      console.error('Error creating loyalty:', error);
      return new Error('Failed to create loyalty');
    }
  }

  async createReward(
    data: InsertLoyaltyReward
  ): Promise<SelectLoyaltyReward | Error> {
    try {
      const query = this._db
        .insertInto('loyalty_rewards')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create loyalty reward', result);
        return new Error('Failed to create loyalty reward');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating loyalty reward:', error);
      return new Error('Failed to create loyalty reward');
    }
  }

  async createShop(
    data: InsertLoyaltyShop
  ): Promise<SelectLoyaltyShop | Error> {
    try {
      const query = this._db
        .insertInto('loyalty_shops')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create loyalty shop', result);
        return new Error('Failed to create loyalty shop');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating loyalty shop:', error);
      return new Error('Failed to create loyalty shop');
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

  async updateReward(data: UpdateLoyaltyReward) {
    try {
      const query = await this._db
        .updateTable('loyalty_rewards')
        .set(data)
        .where('loyalty_rewards.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update loyalty reward', query);
        return new Error('Failed to update loyalty reward');
      }

      return;
    } catch (error) {
      console.error('Error updating loyalty reward:', error);
      return new Error('Failed to update loyalty reward');
    }
  }

  async updateShop(data: UpdateLoyaltyShop) {
    try {
      const query = await this._db
        .updateTable('loyalty_shops')
        .set(data)
        .where('loyalty_shops.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update loyalty shop', query);
        return new Error('Failed to update loyalty shop');
      }

      return;
    } catch (error) {
      console.error('Error updating loyalty shop:', error);
      return new Error('Failed to update loyalty shop');
    }
  }

  async delete(data: DeleteLoyalty) {
    try {
      const transactions = await this._db.transaction().execute(async (trx) => {
        const loyaltys = await trx
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
          return new Error(`Insufficient loyalty, user has ${loyaltySum}`);
        }

        const query = trx
          .insertInto('loyalty_transactions')
          .values({
            user_id: data.user_id,
            amount: data.amount,
            type: 'credit' as const,
            note: data.note,
          })
          .returningAll()
          .compile();

        const result = await trx.executeQuery(query);

        if (result.rows[0] === undefined) {
          console.error('Failed to create loyalty', result);
          return new Error('Failed to create loyalty');
        }

        return;
      });

      return transactions;
    } catch (error) {
      console.error('Error deleting loyalty:', error);
      return new Error('Failed to delete loyalty');
    }
  }

  async deleteReward(id: SelectLoyaltyReward['id']) {
    try {
      const query = await this._db
        .deleteFrom('loyalty_rewards')
        .where('loyalty_rewards.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete loyalty reward', query);
        return new Error('Failed to delete loyalty reward');
      }

      return;
    } catch (error) {
      console.error('Error deleting loyalty reward:', error);
      return new Error('Failed to delete loyalty reward');
    }
  }

  async deleteShop(id: SelectLoyaltyShop['id']) {
    try {
      const query = await this._db
        .deleteFrom('loyalty_shops')
        .where('loyalty_shops.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete loyalty shop', query);
        return new Error('Failed to delete loyalty shop');
      }

      return;
    } catch (error) {
      console.error('Error deleting loyalty shop:', error);
      return new Error('Failed to delete loyalty shop');
    }
  }
}
