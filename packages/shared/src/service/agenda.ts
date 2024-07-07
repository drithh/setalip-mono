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
  FindAllAgendaByCoachOptions,
  SelectCoach,
  SelectBookingParticipant,
  UpdateAgendaBookingById,
} from '../repository';
import { PromiseResult } from '../types';

export interface AgendaService {
  count(): Promise<number>;
  countParticipant(id: SelectAgenda['id']): Promise<number>;

  findAll(data: FindAllAgendaOptions): PromiseResult<SelectAllAgenda, Error>;
  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;
  findAllParticipantByAgendaId(
    id: SelectAgenda['id']
  ): PromiseResult<SelectBookingParticipant[], Error>;
  findTodayScheduleByCoachId(
    coachUserId: SelectCoach['user_id']
  ): PromiseResult<SelectScheduleByDate[], Error>;
  findAllByCoachId(
    data: FindAllAgendaByCoachOptions
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
  updateAgendaBookingById(
    data: UpdateAgendaBookingById
  ): PromiseResult<undefined, Error>;

  delete(id: SelectAgenda['id']): PromiseResult<undefined, Error>;
}
