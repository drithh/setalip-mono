import { Insertable, Selectable, Updateable } from 'kysely';
import { ClassAssets, ClassTypes, Classes, Locations } from '../db';
import { DefaultPagination, OptionalToRequired } from '.';

export interface FindAllClassOptions extends DefaultPagination {
  // name?: string;
  // types?: number[];
}

export interface SelectAllClass {
  data: SelectClass[];
  pageCount: number;
}

export interface SelectClassWithAsset extends ClassWithoutGenerated {
  asset: ClassAssets['url'] | null;
  asset_name: ClassAssets['name'] | null;
  class_type: ClassTypes['type'];
}

type ClassWithoutGenerated = Omit<SelectClass, 'updated_at' | 'updated_by'>;
export interface SelectDetailClassAssetAndLocation extends SelectClass {
  asset: Selectable<ClassAssets>[] | null;
  locations: Record<'name', string>[] | null;
  class_type: ClassTypes['type'];
}

export interface SelectAllClassWithAsset {
  data: SelectClassWithAsset[];
  pageCount: number;
}

export type SelectClass = Selectable<Classes>;
export type SelectClassLocation = Selectable<Locations>;

export type InsertClass = Insertable<Classes>;

export type UpdateClass = OptionalToRequired<Updateable<Classes>, 'id'>;

export type SelectClassAsset = Selectable<ClassAssets>;
export type InsertClassAsset = Insertable<ClassAssets>;
export type UpdateClassAsset = OptionalToRequired<
  Updateable<ClassAssets>,
  'id'
>;
export interface ClassRepository {
  count(): Promise<number>;

  findAll(data: FindAllClassOptions): Promise<SelectAllClass>;
  findAllClassWithAsset(
    data: FindAllClassOptions
  ): Promise<SelectAllClassWithAsset>;
  findById(id: SelectClass['id']): Promise<SelectClass | undefined>;
  findAllLocationById(id: SelectClass['id']): Promise<SelectClassLocation[]>;
  findDetailClassAssetAndLocation(
    id: SelectClass['id']
  ): Promise<SelectDetailClassAssetAndLocation | undefined>;

  create(data: InsertClass): Promise<SelectClass | Error>;
  createAsset(data: InsertClassAsset[]): Promise<SelectClassAsset | Error>;

  update(data: UpdateClass): Promise<undefined | Error>;

  delete(id: SelectClass['id']): Promise<undefined | Error>;
  deleteAsset(id: SelectClass['id']): Promise<undefined | Error>;
}
