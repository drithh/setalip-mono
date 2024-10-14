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

export interface SelectCreditPagination<T extends SelectCredit> {
  data: T[];
  pageCount: number;
}

export interface SelectCreditQuery extends Query<SelectCredit> {}

export type InsertCredit = Insertable<CreditTransactions>;

export interface InsertCreditCommand extends Command<SelectCredit> {
  data: InsertCredit;
}

export type UpdateCredit = Updateable<CreditTransactions>;

export interface UpdateCreditCommand extends Command<SelectCredit> {
  data: UpdateCredit;
}

export interface DeleteCreditCommand extends Command<SelectCredit> {
  filters?: Partial<SelectCredit>;
  withAgendaBooking?: boolean;
}

export interface CreditRepository {
  count(): Promise<number>;
  find<T extends SelectCredit>(data?: SelectCreditQuery): Promise<T[]>;
  findWithPagination<T extends SelectCredit>(
    data?: SelectCreditQuery
  ): Promise<SelectCreditPagination<T>>;

  create(data: InsertCreditCommand): Promise<SelectCredit | Error>;

  update(data: UpdateCreditCommand): Promise<undefined | Error>;

  delete(data: DeleteCreditCommand): Promise<undefined | Error>;
}
