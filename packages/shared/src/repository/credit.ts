import {
  ExpressionBuilder,
  Insertable,
  Selectable,
  SelectQueryBuilder,
  Transaction,
  Updateable,
} from 'kysely';
import { Command, CreditTransactions, DB, Query } from '../db';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectUser,
} from '.';

export type SelectCredit = Selectable<CreditTransactions>;

export interface SelectCreditPagination {
  data: SelectCredit[];
  pageCount: number;
}
export type SelectCreditPick<
  T extends keyof CreditTransactions = keyof CreditTransactions,
> = Pick<CreditTransactions, T>;
export interface SelectCreditQuery extends Query<SelectCredit> {}

export type InsertCredit = Insertable<CreditTransactions>;

export interface InsertCreditCommand extends Command {
  data: InsertCredit;
}

export type UpdateCredit = OptionalToRequired<
  Updateable<CreditTransactions>,
  'id'
>;

export interface UpdateCreditCommand extends Command {
  data: UpdateCredit;
}

export interface DeleteCreditCommand extends Command {
  filters: Partial<SelectCredit>;
}

export interface CreditRepository {
  count(): Promise<number>;
  find<T extends keyof CreditTransactions>(
    data?: SelectCreditQuery
  ): Promise<SelectCredit[]>;
  findWithPagination(data?: SelectCreditQuery): Promise<SelectCreditPagination>;

  create(data: InsertCreditCommand): Promise<SelectCredit | Error>;

  update(data: UpdateCreditCommand): Promise<undefined | Error>;

  delete(data: DeleteCreditCommand): Promise<undefined | Error>;
}
