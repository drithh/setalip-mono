import { Insertable, Selectable, Updateable } from 'kysely';
import { Packages } from '../db';
import { DefaultPagination, OptionalToRequired } from '.';

export interface FindAllPackageOptions extends DefaultPagination {
  name?: string;
  types?: number[];
}

export interface SelectAllPackage {
  data: SelectPackage[];
  pageCount: number;
}

export type SelectPackage = Selectable<Packages>;

export type InsertPackage = Insertable<Packages>;

export type UpdatePackage = OptionalToRequired<Updateable<Packages>, 'id'>;

export interface PackageRepository {
  findAll(data: FindAllPackageOptions): Promise<SelectAllPackage>;
  findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;

  create(data: InsertPackage): Promise<SelectPackage | Error>;

  update(data: UpdatePackage): Promise<undefined | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
}
