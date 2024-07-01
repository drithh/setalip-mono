import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllAgendaOptions,
  InsertAgenda,
  AgendaRepository,
  SelectAgenda,
  UpdateAgenda,
  InsertAgendaBooking,
  UpdateAgendaBooking,
  FindScheduleByDateOptions,
  FindAgendaByUserOptions,
} from '../repository';
import { AgendaService } from './agenda';

@injectable()
export class AgendaServiceImpl implements AgendaService {
  private _agendaRepository: AgendaRepository;

  constructor(
    @inject(TYPES.AgendaRepository) agendaRepository: AgendaRepository
  ) {
    this._agendaRepository = agendaRepository;
  }

  async findAll(data: FindAllAgendaOptions) {
    const agendas = await this._agendaRepository.findAll(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async findById(id: SelectAgenda['id']) {
    const singleAgenda = await this._agendaRepository.findById(id);

    if (!singleAgenda) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    return {
      result: singleAgenda,
    };
  }

  async findScheduleByDate(data: FindScheduleByDateOptions) {
    const schedules = await this._agendaRepository.findScheduleByDate(data);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleById(id: SelectAgenda['id']) {
    const singleSchedule = await this._agendaRepository.findScheduleById(id);

    if (!singleSchedule) {
      return {
        error: new Error('Schedule not found'),
      };
    }

    return {
      result: singleSchedule,
    };
  }

  async findAgendaByUserId(data: FindAgendaByUserOptions) {
    const agendas = await this._agendaRepository.findAgendaByUserId(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async create(data: InsertAgenda) {
    const result = await this._agendaRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateAgenda) {
    const result = await this._agendaRepository.update(data);

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

  async updateAgendaBooking(data: UpdateAgendaBooking) {
    const result = await this._agendaRepository.updateAgendaBooking(data);

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

  async delete(id: SelectAgenda['id']) {
    const result = await this._agendaRepository.delete(id);

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
