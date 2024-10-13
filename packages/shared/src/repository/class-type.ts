import { CompiledQuery, Insertable, Selectable, Updateable } from 'kysely';
import { ClassTypes, Command, Query } from '../db';
import { OptionalToRequired } from '.';

export type SelectClassType = Selectable<ClassTypes>;

export interface SelectClassTypeQuery extends Query<SelectClassType> {}

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

export interface ClassTypeRepository {
  count(): Promise<number>;

  find(data?: SelectClassTypeQuery): Promise<SelectClassType[]>;
  create(data: InsertClassTypeCommand): Promise<SelectClassType | Error>;
  update(data: UpdateClassTypeCommand): Promise<undefined | Error>;
  delete(data: DeleteClassTypeCommand): Promise<undefined | Error>;
}
