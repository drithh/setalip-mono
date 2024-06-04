import { Insertable, Selectable, Updateable } from 'kysely';
import { Classes, Locations } from '../db';
import { DefaultPagination, OptionalToRequired } from '.';

export interface FindAllClassOptions extends DefaultPagination {
  // name?: string;
  // types?: number[];
}

export interface SelectAllClass {
  data: SelectClass[];
  pageCount: number;
}

export type SelectClass = Selectable<Classes>;
export type SelectClassLocation = Selectable<Locations>;

export type InsertClass = Insertable<Classes>;

export type UpdateClass = OptionalToRequired<Updateable<Classes>, 'id'>;

export interface ClassRepository {
  findAll(data: FindAllClassOptions): Promise<SelectAllClass>;
  findById(id: SelectClass['id']): Promise<SelectClass | undefined>;
  findAllLocationById(id: SelectClass['id']): Promise<SelectClassLocation[]>;

  create(data: InsertClass): Promise<SelectClass | Error>;

  update(data: UpdateClass): Promise<undefined | Error>;

  delete(id: SelectClass['id']): Promise<undefined | Error>;
}
