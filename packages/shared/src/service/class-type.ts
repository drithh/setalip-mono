import {
  SelectClassType,
  InsertClassType,
  UpdateClassType,
} from '../repository';
import { PromiseResult } from '../types';
export interface FindAllIncomeByMonthAndLocationOption {
  date: Date;
  location_id: number;
}
export type ClassTypeWithIncome = {
  participant: number;
  income: number;
};

export interface SelectClassType__Income extends ClassTypeWithIncome {}

export interface ClassTypeService {
  findAll(): PromiseResult<SelectClassType[], Error>;
  findAllIncomeByMonthAndLocation(
    data: FindAllIncomeByMonthAndLocationOption
  ): PromiseResult<SelectClassType__Income[], Error>;
  findById(
    id: SelectClassType['id']
  ): PromiseResult<SelectClassType | undefined, Error>;

  create(data: InsertClassType): PromiseResult<SelectClassType, Error>;

  update(data: UpdateClassType): PromiseResult<undefined, Error>;

  delete(id: SelectClassType['id']): PromiseResult<undefined, Error>;
}
