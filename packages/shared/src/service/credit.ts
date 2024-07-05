import {
  SelectCredit,
  InsertCredit,
  UpdateCredit,
  DeleteCredit,
  SelectAmountCredit,
  FindAllCreditOptions,
  SelectAllCredit,
} from '../repository';
import { PromiseResult } from '../types';

export interface CreditService {
  findAll(): PromiseResult<SelectCredit[], Error>;
  findById(
    id: SelectCredit['id']
  ): PromiseResult<SelectCredit | undefined, Error>;
  findByUserPackageId(
    id: SelectCredit['user_package_id']
  ): PromiseResult<SelectCredit | undefined, Error>;

  findAmountByUserId(
    userId: SelectCredit['user_id']
  ): PromiseResult<SelectAmountCredit[], Error>;
  findAllByUserId(
    data: FindAllCreditOptions
  ): PromiseResult<SelectAllCredit, Error>;

  create(data: InsertCredit): PromiseResult<SelectCredit, Error>;

  update(data: UpdateCredit): PromiseResult<undefined, Error>;

  delete(id: DeleteCredit): PromiseResult<undefined, Error>;
}
