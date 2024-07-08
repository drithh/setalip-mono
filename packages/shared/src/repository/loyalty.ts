import { Insertable, Selectable, Updateable } from 'kysely';
import { LoyaltyTransactions } from '../db';
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

export interface LoyaltyRepository {
  count(): Promise<number>;

  findAll(data: FindAllLoyaltyOptions): Promise<SelectAllLoyalty>;
  findById(id: SelectLoyalty['id']): Promise<SelectLoyalty | undefined>;

  findAmountByUserId(
    userId: SelectUser['id']
  ): Promise<SelectAmountLoyalty | undefined>;
  findAllByUserId(
    data: FindAllLoyaltyByUserIdOptions
  ): Promise<SelectAllLoyaltyByUserId>;

  create(data: InsertLoyalty): Promise<SelectLoyalty | Error>;

  update(data: UpdateLoyalty): Promise<undefined | Error>;

  delete(id: DeleteLoyalty): Promise<undefined | Error>;
}
