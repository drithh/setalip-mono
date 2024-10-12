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
export interface FindAllCreditOptions extends DefaultPagination {
  user_id: SelectUser['id'];
}
export interface SelectCreditPagination {
  data: SelectCredit[];
  pageCount: number;
}

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

  find(data?: SelectCreditQuery): Promise<SelectCredit[]>;
  findWithCount(data?: SelectCreditQuery): Promise<SelectCredit[]>;
  // findById(id: SelectCredit['id']): Promise<SelectCredit | undefined>;
  // findByUserPackageId(
  //   id: SelectCredit['user_package_id']
  // ): Promise<SelectCredit | undefined>;
  // findAllByUserId(data: FindAllCreditOptions): Promise<SelectCreditPagination>;

  create(data: InsertCreditCommand): Promise<SelectCredit | Error>;

  update(data: UpdateCreditCommand): Promise<undefined | Error>;

  delete(data: DeleteCreditCommand): Promise<undefined | Error>;
}
