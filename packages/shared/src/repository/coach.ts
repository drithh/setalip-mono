import { Insertable, Selectable, Updateable } from 'kysely';
import { Coaches } from '../db';
import { OptionalToRequired, SelectUser } from '.';

export type SelectCoach = Selectable<Coaches>;
export type SelectCoachWithUser = SelectCoach & { name: SelectUser['name'] };
export type InsertCoach = Insertable<Coaches>;
export type UpdateCoach = OptionalToRequired<Updateable<Coaches>, 'id'>;

export interface CoachRepository {
  count(): Promise<number>;

  findAll(): Promise<SelectCoachWithUser[]>;
  findById(id: SelectCoach['id']): Promise<SelectCoach | undefined>;
  findByUserId(
    userId: SelectCoach['user_id']
  ): Promise<SelectCoach | undefined>;

  create(data: InsertCoach): Promise<SelectCoach | Error>;

  update(data: UpdateCoach): Promise<undefined | Error>;

  delete(id: SelectCoach['id']): Promise<undefined | Error>;
}
