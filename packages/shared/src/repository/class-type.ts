import { Insertable, Selectable, Updateable } from 'kysely';
import { ClassTypes } from '../db';
import { OptionalToRequired } from '.';

export type SelectClassType = Selectable<ClassTypes>;

export type InsertClassType = Insertable<ClassTypes>;

export type UpdateClassType = OptionalToRequired<Updateable<ClassTypes>, 'id'>;

export interface ClassTypeRepository {
  count(): Promise<number>;

  findAll(): Promise<SelectClassType[]>;
  findById(id: SelectClassType['id']): Promise<SelectClassType | undefined>;
  create(data: InsertClassType): Promise<SelectClassType | Error>;
  update(data: UpdateClassType): Promise<undefined | Error>;
  delete(id: SelectClassType['id']): Promise<undefined | Error>;
}
