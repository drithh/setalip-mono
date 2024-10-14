import { CompiledQuery, Insertable, Selectable, Updateable } from 'kysely';
import { ClassTypes, Command, Query } from '../db';
import { OptionalToRequired } from '.';
import { ClassTypeWithIncome } from '../service';

export type SelectClassType = Selectable<ClassTypes>;

export interface SelectClassTypeQuery extends Query<SelectClassType> {
  withIncome?: boolean;
}

export type InsertClassType = Insertable<ClassTypes>;

export interface InsertClassTypeCommand extends Command<SelectClassType> {
  data: InsertClassType;
}

export type UpdateClassType = Updateable<ClassTypes>;

export interface UpdateClassTypeCommand extends Command<SelectClassType> {
  data: UpdateClassType;
}

export interface DeleteClassTypeCommand extends Command<SelectClassType> {
  filters: Partial<SelectClassType>;
}
export type SelectClassTypeReturn<T extends SelectClassTypeQuery> =
  (SelectClassType &
    (T['withIncome'] extends true ? ClassTypeWithIncome : {}))[];

export interface ClassTypeRepository {
  count(): Promise<number>;

  find<T extends SelectClassTypeQuery>(
    x?: T
  ): Promise<SelectClassTypeReturn<T>>;

  create(data: InsertClassTypeCommand): Promise<SelectClassType | Error>;
  update(data: UpdateClassTypeCommand): Promise<undefined | Error>;
  delete(data: DeleteClassTypeCommand): Promise<undefined | Error>;
}
