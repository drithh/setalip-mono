import {
  SelectAgenda,
  InsertAgenda,
  UpdateAgenda,
  FindAllAgendaOptions,
  SelectAllAgenda,
  SelectAgendaBooking,
  InsertAgendaBooking,
  UpdateAgendaBooking,
  FindScheduleByDateOptions,
  SelectAllSchedule,
} from '../repository';
import { PromiseResult } from '../types';

export interface AgendaService {
  findAll(data: FindAllAgendaOptions): PromiseResult<SelectAllAgenda, Error>;
  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): PromiseResult<SelectAllSchedule, Error>;

  create(data: InsertAgenda): PromiseResult<SelectAgenda, Error>;

  update(data: UpdateAgenda): PromiseResult<undefined, Error>;
  updateAgendaBooking(
    data: UpdateAgendaBooking
  ): PromiseResult<undefined, Error>;

  delete(id: SelectAgenda['id']): PromiseResult<undefined, Error>;
}
