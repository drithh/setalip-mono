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
  DeleteAgenda,
  UpdateAgendaBookingParticipant,
  CancelAgenda,
  DeleteParticipant,
  InsertAgendaBookingByAdmin,
  SelectAgendaRecurrence,
  FindScheduleByIdOptions,
  FindAllAgendaRecurrenceOption,
  SelectAllAgendaRecurrence,
  UpdateAgendaRecurrence,
  InsertAgendaRecurrence,
  FindAllAgendaBookingByMonthAndLocation,
  SelectAgendaBookingWithIncome,
  SelectCoachAgendaBooking,
} from '../repository';
import { PromiseResult } from '../types';

export interface AgendaService {
  count(): Promise<number>;
  countParticipant(id: SelectAgenda['id']): Promise<number>;
  countCheckedInByUserId(
    userId: SelectAgenda['id']
  ): Promise<number | undefined>;
  countCoachAgenda(userId: SelectCoach['user_id']): Promise<number>;

  findAll(data: FindAllAgendaOptions): PromiseResult<SelectAllAgenda, Error>;
  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;
  findAllAgendaBookingByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ): PromiseResult<SelectAgendaBookingWithIncome[], Error>;
  findAllCoachAgendaByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ): PromiseResult<SelectCoachAgendaBooking[], Error>;
  findAllAgendaBookingByAgendaId(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgendaBooking[], Error>;
  findAllAgendaRecurrence(
    data: FindAllAgendaRecurrenceOption
  ): PromiseResult<SelectAllAgendaRecurrence, Error>;
  findAgendaBookingById(
    id: SelectAgendaBooking['id']
  ): PromiseResult<SelectAgendaBooking | undefined, Error>;
  findAllParticipantByAgendaId(
    id: SelectAgenda['id']
  ): PromiseResult<SelectBookingParticipant[], Error>;
  findTodayScheduleByCoachId(
    coachUserId: SelectCoach['user_id']
  ): PromiseResult<SelectScheduleByDate[], Error>;
  findAllByCoachId(
    data: FindAllAgendaByCoachOptions
  ): PromiseResult<SelectAllSchedule, Error>;
  findAgendaRecurrenceById(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<SelectAgendaRecurrence, Error>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): PromiseResult<SelectAllSchedule, Error>;
  findScheduleById(
    data: FindScheduleByIdOptions
  ): PromiseResult<SelectScheduleByDate, Error>;
  findAgendaByUserId(
    data: FindAgendaByUserOptions
  ): PromiseResult<SelectAllAgendaByUser, Error>;

  create(data: InsertAgenda): PromiseResult<SelectAgenda, Error>;
  createAgendaBooking(
    data: InsertAgendaBooking
  ): PromiseResult<SelectAgendaBooking, Error>;
  createAgendaBookingByAdmin(
    data: InsertAgendaBookingByAdmin
  ): PromiseResult<SelectAgendaBooking, Error>;
  createAgendaRecurrence(
    data: InsertAgendaRecurrence
  ): PromiseResult<SelectAgendaRecurrence, Error>;

  update(data: UpdateAgenda): PromiseResult<undefined, Error>;
  updateAgendaBooking(
    data: UpdateAgendaBooking
  ): PromiseResult<undefined, Error>;
  updateAgendaRecurrence(
    data: UpdateAgendaRecurrence
  ): PromiseResult<undefined, Error>;
  updateAgendaBookingParticipant(
    data: UpdateAgendaBookingParticipant
  ): PromiseResult<undefined, Error>;
  updateAgendaBookingById(
    data: UpdateAgendaBookingById
  ): PromiseResult<undefined, Error>;

  delete(data: DeleteAgenda): PromiseResult<undefined, Error>;
  deleteAgendaRecurrence(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<undefined, Error>;
  deleteAgendaBooking(data: DeleteParticipant): PromiseResult<undefined, Error>;
  cancel(data: CancelAgenda): PromiseResult<undefined, Error>;
}
