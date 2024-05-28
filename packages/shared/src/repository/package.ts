import { Insertable, Selectable, Updateable } from 'kysely';
import { Packages } from '../db';
import { OptionalToRequired } from '.';

export type SelectPackage = Selectable<Packages>;

export type InsertPackage = Insertable<Packages>;

export type UpdatePackage = OptionalToRequired<Updateable<Packages>, 'id'>;

export interface PackageRepository {
  findAll(): Promise<SelectPackage[]>;
  findById(id: SelectPackage['id']): Promise<SelectPackage | undefined>;

  create(data: InsertPackage): Promise<SelectPackage | Error>;

  update(data: UpdatePackage): Promise<undefined | Error>;

  delete(id: SelectPackage['id']): Promise<undefined | Error>;
}
