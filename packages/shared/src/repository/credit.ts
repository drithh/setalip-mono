import { Insertable, Selectable, Updateable } from 'kysely';
import { CreditTransactions } from '../db';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectUser,
} from '.';

export type SelectCredit = Selectable<CreditTransactions>;
export type InsertCredit = Insertable<CreditTransactions>;
export type UpdateCredit = OptionalToRequired<
  Updateable<CreditTransactions>,
  'id'
>;
export interface DeleteCredit {
  user_id: SelectCredit['user_id'];
  class_type_id: SelectCredit['class_type_id'];
  amount: SelectCredit['amount'];
  note: SelectCredit['note'];
}
export interface SelectAmountCredit {
  class_type_id: SelectCredit['class_type_id'];
  class_type_name: SelectClassType['type'];
  remaining_amount: SelectCredit['amount'];
}

export interface FindAllCreditOptions extends DefaultPagination {
  types?: SelectCredit['type'][];
}

// export interface SelectCredits extends SelectCredit {
//   class_type: ClassTypes['type'];
// }

export interface SelectAllCredit {
  data: SelectCredit[];
  pageCount: number;
}

export interface CreditRepository {
  findAll(): Promise<SelectCredit[]>;
  findById(id: SelectCredit['id']): Promise<SelectCredit | undefined>;
  findAmountByUserId(
    userId: SelectCredit['user_id']
  ): Promise<SelectAmountCredit[]>;
  findAllByUserId(data: FindAllCreditOptions): Promise<SelectAllCredit>;

  create(data: InsertCredit): Promise<SelectCredit | Error>;

  update(data: UpdateCredit): Promise<undefined | Error>;

  delete(id: DeleteCredit): Promise<undefined | Error>;
}
