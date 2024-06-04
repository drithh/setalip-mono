import {
  SelectCoach,
  InsertCoach,
  UpdateCoach,
  SelectCoachWithUser,
  // FindAllCoachOptions,
  // SelectAllCoach,
} from '../repository';
import { PromiseResult } from '../types';

export interface CoachService {
  findAll(): PromiseResult<SelectCoachWithUser[], Error>;
  findById(
    id: SelectCoach['id']
  ): PromiseResult<SelectCoach | undefined, Error>;
  findByUserId(
    userId: SelectCoach['user_id']
  ): PromiseResult<SelectCoach | undefined, Error>;

  create(data: InsertCoach): PromiseResult<SelectCoach, Error>;

  update(data: UpdateCoach): PromiseResult<undefined, Error>;

  delete(id: SelectCoach['id']): PromiseResult<undefined, Error>;
}
