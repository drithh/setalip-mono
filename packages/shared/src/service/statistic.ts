import {
  SelectStatistic,
  InsertStatistic,
  UpdateStatistic,
  FindAllStatisticOption,
  SelectAllStatistic,
  SelectStatisticWithParticipation,
  SelectUser,
} from '../repository';
import { PromiseResult } from '../types';

export interface StatisticService {
  findAll(
    data: FindAllStatisticOption
  ): PromiseResult<SelectAllStatistic, Error>;
  findById(
    id: SelectStatistic['id']
  ): PromiseResult<SelectStatistic | undefined, Error>;
  findByUser(
    user_id: SelectUser['id']
  ): PromiseResult<SelectStatisticWithParticipation, Error>;

  create(data: InsertStatistic): PromiseResult<SelectStatistic, Error>;

  update(data: UpdateStatistic): PromiseResult<undefined, Error>;

  delete(id: SelectStatistic['id']): PromiseResult<undefined, Error>;
}
