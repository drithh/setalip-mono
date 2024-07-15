import { Insertable, Selectable, Updateable } from 'kysely';
import { Statistics } from '../db';
import { DefaultPagination, OptionalToRequired, SelectUser } from '.';

export type SelectStatistic = Selectable<Statistics>;

export type InsertStatistic = Insertable<Statistics>;

export type UpdateStatistic = OptionalToRequired<Updateable<Statistics>, 'id'>;

export interface SelectStatisticWithParticipation {
  statistic: SelectStatistic[];
  participation: number;
}

export interface FindAllStatisticOption extends DefaultPagination {
  role?: SelectStatistic['role'][];
}

export interface SelectAllStatistic {
  data: SelectStatistic[];
  pageCount: number;
}

export interface StatisticRepository {
  count(): Promise<number>;

  findAll(data: FindAllStatisticOption): Promise<SelectAllStatistic>;
  findById(id: SelectStatistic['id']): Promise<SelectStatistic | undefined>;
  findByUser(
    user_id: SelectUser['id']
  ): Promise<SelectStatisticWithParticipation>;

  create(data: InsertStatistic): Promise<SelectStatistic | Error>;
  update(data: UpdateStatistic): Promise<undefined | Error>;
  delete(id: SelectStatistic['id']): Promise<undefined | Error>;
}
