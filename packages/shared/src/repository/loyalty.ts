import { Insertable, Selectable, Updateable } from 'kysely';
import { LoyaltyRewards, LoyaltyShops, LoyaltyTransactions } from '../db';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectUser,
} from '.';

export type SelectLoyalty = Selectable<LoyaltyTransactions>;
export type InsertLoyalty = Insertable<LoyaltyTransactions>;
export type UpdateLoyalty = OptionalToRequired<
  Updateable<LoyaltyTransactions>,
  'id'
>;

interface SelectLoyaltyWithUser extends SelectLoyalty {
  user_name: SelectUser['name'];
  user_email: SelectUser['email'];
}

export interface SelectAmountLoyalty {
  user_id: SelectLoyalty['user_id'];
  total_credit: number;
  total_debit: number;
}

export interface DeleteLoyalty {
  user_id: SelectLoyalty['user_id'];
  amount: SelectLoyalty['amount'];
  note: SelectLoyalty['note'];
}

export interface FindAllLoyaltyByUserIdOptions extends DefaultPagination {
  types?: SelectLoyalty['type'][];
  user_id: SelectUser['id'];
}

export interface FindAllLoyaltyOptions extends DefaultPagination {
  types?: SelectLoyalty['type'][];
  user_name?: SelectUser['name'];
}

export interface SelectAllLoyaltyByUserId {
  data: SelectLoyalty[];
  pageCount: number;
}

export interface SelectAllLoyalty {
  data: SelectLoyaltyWithUser[];
  pageCount: number;
}

export type SelectLoyaltyReward = Selectable<LoyaltyRewards>;
export type InsertLoyaltyReward = Insertable<LoyaltyRewards>;
export type UpdateLoyaltyReward = OptionalToRequired<
  Updateable<LoyaltyRewards>,
  'id'
>;

export interface FindAllLoyaltyRewardOptions extends DefaultPagination {
  name?: SelectLoyaltyReward['name'];
  is_active?: SelectLoyaltyReward['is_active'];
}

export interface SelectAllLoyaltyReward {
  data: SelectLoyaltyReward[];
  pageCount: number;
}

export type SelectLoyaltyShop = Selectable<LoyaltyShops>;
export type InsertLoyaltyShop = Insertable<LoyaltyShops>;
export type UpdateLoyaltyShop = OptionalToRequired<
  Updateable<LoyaltyShops>,
  'id'
>;

export interface FindAllLoyaltyShopOptions extends DefaultPagination {
  name?: SelectLoyaltyShop['name'];
}

export interface SelectAllLoyaltyShop {
  data: SelectLoyaltyShop[];
  pageCount: number;
}

export interface InsertLoyaltyOnReward {
  reward_id: SelectLoyaltyReward['id'];
  user_id: SelectUser['id'];
  note: SelectLoyalty['note'];
  reference_id?: SelectLoyalty['reference_id'];
}
export interface LoyaltyRepository {
  count(): Promise<number>;

  findAll(data: FindAllLoyaltyOptions): Promise<SelectAllLoyalty>;
  findAllReward(
    data: FindAllLoyaltyRewardOptions
  ): Promise<SelectAllLoyaltyReward>;
  findAllShop(data: FindAllLoyaltyShopOptions): Promise<SelectAllLoyaltyShop>;
  findAllByUserId(
    data: FindAllLoyaltyByUserIdOptions
  ): Promise<SelectAllLoyaltyByUserId>;

  findById(id: SelectLoyalty['id']): Promise<SelectLoyalty | undefined>;
  findRewardById(
    id: SelectLoyaltyReward['id']
  ): Promise<SelectLoyaltyReward | undefined>;
  findRewardByName(
    name: SelectLoyaltyReward['name']
  ): Promise<SelectLoyaltyReward | undefined>;
  findShopByName(
    name: SelectLoyaltyShop['name']
  ): Promise<SelectLoyaltyShop | undefined>;
  findAmountByUserId(
    userId: SelectUser['id']
  ): Promise<SelectAmountLoyalty | undefined>;

  create(data: InsertLoyalty): Promise<SelectLoyalty | Error>;
  createOnReward(data: InsertLoyaltyOnReward): Promise<undefined | Error>;
  createReward(data: InsertLoyaltyReward): Promise<SelectLoyaltyReward | Error>;
  createShop(data: InsertLoyaltyShop): Promise<SelectLoyaltyShop | Error>;

  update(data: UpdateLoyalty): Promise<undefined | Error>;
  updateReward(data: UpdateLoyaltyReward): Promise<undefined | Error>;
  updateShop(data: UpdateLoyaltyShop): Promise<undefined | Error>;

  delete(id: DeleteLoyalty): Promise<undefined | Error>;
  deleteReward(id: SelectLoyaltyReward['id']): Promise<undefined | Error>;
  deleteShop(id: SelectLoyaltyShop['id']): Promise<undefined | Error>;
}
