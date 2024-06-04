import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertCoach,
  CoachRepository,
  SelectCoach,
  UpdateCoach,
} from '../repository';
import { CoachService } from './coach';

@injectable()
export class CoachServiceImpl implements CoachService {
  private _coachRepository: CoachRepository;

  constructor(@inject(TYPES.CoachRepository) coachRepository: CoachRepository) {
    this._coachRepository = coachRepository;
  }

  async findAll() {
    const coaches = await this._coachRepository.findAll();

    return {
      result: coaches,
      error: undefined,
    };
  }

  async findById(id: SelectCoach['id']) {
    const coach = await this._coachRepository.findById(id);

    if (!coach) {
      return {
        error: new Error('Coach not found'),
      };
    }

    return {
      result: coach,
    };
  }

  async findByUserId(userId: SelectCoach['user_id']) {
    const coach = await this._coachRepository.findByUserId(userId);

    if (!coach) {
      return {
        error: new Error('Coach not found'),
      };
    }

    return {
      result: coach,
    };
  }

  async create(data: InsertCoach) {
    const result = await this._coachRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateCoach) {
    const result = await this._coachRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async delete(id: SelectCoach['id']) {
    const result = await this._coachRepository.delete(id);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }
}
