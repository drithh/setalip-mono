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
  SelectAllAgendaByUser,
  FindAgendaByUserOptions,
  SelectScheduleByDate,
} from '../repository';
import { PromiseResult } from '../types';

export interface AgendaService {
  count(): Promise<number>;
  countParticipant(id: SelectAgenda['id']): Promise<number>;

  findAll(data: FindAllAgendaOptions): PromiseResult<SelectAllAgenda, Error>;
  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;
  findAllByCoachId(
    data: FindAllAgendaOptions
  ): PromiseResult<SelectAllSchedule, Error>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): PromiseResult<SelectAllSchedule, Error>;
  findScheduleById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectScheduleByDate, Error>;
  findAgendaByUserId(
    data: FindAgendaByUserOptions
  ): PromiseResult<SelectAllAgendaByUser, Error>;

  create(data: InsertAgenda): PromiseResult<SelectAgenda, Error>;
  createAgendaBooking(
    data: InsertAgendaBooking
  ): PromiseResult<SelectAgendaBooking, Error>;
  update(data: UpdateAgenda): PromiseResult<undefined, Error>;
  updateAgendaBooking(
    data: UpdateAgendaBooking
  ): PromiseResult<undefined, Error>;

  delete(id: SelectAgenda['id']): PromiseResult<undefined, Error>;
}
