import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { StatisticService } from './index';
import type {
  StatisticRepository,
  InsertStatistic,
  SelectStatistic,
  UpdateStatistic,
  FindAllStatisticOption,
  SelectUser,
} from '../repository';

@injectable()
export class StatisticServiceImpl implements StatisticService {
  private _statisticRepository: StatisticRepository;

  constructor(
    @inject(TYPES.StatisticRepository)
    statisticRepository: StatisticRepository
  ) {
    this._statisticRepository = statisticRepository;
  }

  async findAll(data: FindAllStatisticOption) {
    const statistics = await this._statisticRepository.findAll(data);

    return {
      result: statistics,
      error: undefined,
    };
  }

  async findById(id: SelectStatistic['id']) {
    const statistic = await this._statisticRepository.findById(id);

    if (!statistic) {
      return {
        error: new Error('Class type not found'),
      };
    }

    return {
      result: statistic,
    };
  }

  async findByUser(user_id: SelectUser['id']) {
    const statistic = await this._statisticRepository.findByUser(user_id);

    if (!statistic) {
      return {
        error: new Error('Class type not found'),
      };
    }

    return {
      result: statistic,
    };
  }

  async create(data: InsertStatistic) {
    const result = await this._statisticRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateStatistic) {
    const result = await this._statisticRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result,
    };
  }

  async delete(id: SelectStatistic['id']) {
    const result = await this._statisticRepository.delete(id);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result,
    };
  }
}
