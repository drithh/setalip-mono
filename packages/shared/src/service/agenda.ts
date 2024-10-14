import {
  SelectAgenda,
  SelectCoach,
  SelectAgendaBooking,
  SelectAgendaRecurrence,
  InsertAgenda,
  InsertAgendaBooking,
  InsertAgendaRecurrence,
  UpdateAgenda,
  UpdateAgendaBooking,
  UpdateAgendaRecurrence,
  DefaultPagination,
  SelectUser,
  SelectClass,
  SelectClassType,
  SelectLocation,
  SelectAgendaPagination,
  SelectFacility,
} from '../repository';
import { PromiseResult } from '../types';
export interface FindAllAgendaOptions extends DefaultPagination {
  className?: SelectClass['name'];
  coaches?: SelectCoach['id'][];
  locations: SelectLocation['id'][];
  date: Date;
}

export interface FindAllAgendaByCoachOptions extends DefaultPagination {
  locations: SelectLocation['id'][];
  classTypes?: SelectClassType['id'][];
  coachUserId: SelectCoach['user_id'];
  date?: Date;
}

export interface FindAgendaByUserOptions extends DefaultPagination {
  coaches?: SelectCoach['id'][];
  locations: SelectLocation['id'][];
  classTypes?: SelectClassType['id'][];
  userId: SelectUser['id'];
}

export interface FindScheduleByDateOptions extends DefaultPagination {
  coaches?: SelectCoach['id'][];
  locations?: SelectLocation['id'][];
  classTypes?: SelectClassType['id'][];
  classNames?: SelectClass['id'][];
  date: Date;
}

export interface FindScheduleByIdOptions {
  id?: SelectAgenda['id'];
  agendaRecurrenceId?: SelectAgenda['agenda_recurrence_id'];
  time?: SelectAgenda['time'];
}

export type AgendaWithCoach = {
  coach_name: SelectUser['name'];
  coach_id: SelectCoach['id'];
};

export type AgendaWithClass = {
  class_id: SelectClass['id'];
  class_name: SelectClass['name'];
  class_slot: SelectClass['slot'];
  class_duration: SelectClass['duration'];
  class_type_id: SelectClassType['id'];
  class_type_name: SelectClassType['type'];
};

export type AgendaWithParticipant = {
  agenda_booking_id: SelectAgendaBooking['id'];
  agenda_booking_status: SelectAgendaBooking['status'];

  user_id: SelectUser['id'];
  user_name: SelectUser['name'];
};

export type AgendaWithLocation = {
  location_name: SelectLocation['name'];
  location_id: SelectLocation['id'];
  location_link_maps: SelectLocation['link_maps'];
  location_address: SelectLocation['address'];
  location_facility_name: SelectFacility['name'];
};

export type AgendaWithAgendaBooking = {
  agenda_booking_id: SelectAgendaBooking['id'];
  agenda_booking_status: SelectAgendaBooking['status'];
  agenda_booking_updated_at: SelectAgendaBooking['updated_at'];
};

export interface SelectAgenda__Coach__Class__Location__Participant
  extends SelectAgenda,
    AgendaWithCoach,
    AgendaWithClass,
    AgendaWithLocation {
  participants: AgendaWithParticipant[] | null;
}

export interface SelectAgenda__Participant extends SelectAgenda {
  participants: AgendaWithParticipant[] | null;
}

export interface SelectAgenda__Coach__Class__Location
  extends SelectAgenda,
    AgendaWithLocation,
    AgendaWithCoach,
    AgendaWithClass {
  participant: number | null;
}

export interface SelectAgenda__Coach__Class__Location__AgendaBooking
  extends SelectAgenda,
    AgendaWithLocation,
    AgendaWithCoach,
    AgendaWithClass,
    AgendaWithAgendaBooking {}

export interface DefaultReturn<T> {
  data: T[];
  pageCount: number;
}

export interface AgendaService {
  count(): Promise<number>;
  countParticipant(id: SelectAgenda['id']): Promise<number>;
  countCheckedInByUserId(
    userId: SelectAgenda['id']
  ): Promise<number | undefined>;
  countCoachAgenda(userId: SelectCoach['user_id']): Promise<number>;

  findAll(
    data: FindAllAgendaOptions
  ): PromiseResult<
    DefaultReturn<SelectAgenda__Coach__Class__Location__Participant>,
    Error
  >;
  findAllByCoachId(
    data: FindAllAgendaByCoachOptions
  ): PromiseResult<DefaultReturn<SelectAgenda__Coach__Class__Location>, Error>;
  findAllByUserId(
    data: FindAgendaByUserOptions
  ): PromiseResult<
    DefaultReturn<SelectAgenda__Coach__Class__Location__AgendaBooking>,
    Error
  >;

  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;
  findAllParticipantByAgendaId(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda__Participant, Error>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): PromiseResult<DefaultReturn<SelectAgenda__Coach__Class__Location>, Error>;
  findTodayScheduleByCoachId(
    coachUserId: SelectCoach['user_id']
  ): PromiseResult<SelectAgenda__Coach__Class__Location[], Error>;
  findScheduleById(
    data: FindScheduleByIdOptions
  ): PromiseResult<SelectAgenda__Coach__Class__Location, Error>;

  // // better with agendabooking

  findAllCoachAgendaByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ): PromiseResult<SelectCoachAgendaBooking[], Error>;
  // findAllAgendaBookingByAgendaId(
  //   id: SelectAgenda['id']
  // ): PromiseResult<SelectAgendaBooking[], Error>;
  // findAgendaBookingById(
  //   id: SelectAgendaBooking['id']
  // ): PromiseResult<SelectAgendaBooking | undefined, Error>;

  // findAllAgendaRecurrence(
  //   data: FindAllAgendaRecurrenceOption
  // ): PromiseResult<SelectAllAgendaRecurrence, Error>;
  // findAgendaRecurrenceById(
  //   id: SelectAgendaRecurrence['id']
  // ): PromiseResult<SelectAgendaRecurrence, Error>;

  // create(data: InsertAgenda): PromiseResult<SelectAgenda, Error>;
  // createAgendaBooking(
  //   data: InsertAgendaBooking
  // ): PromiseResult<SelectAgendaBooking, Error>;
  // createAgendaBookingByAdmin(
  //   data: InsertAgendaBookingByAdmin
  // ): PromiseResult<SelectAgendaBooking, Error>;
  // createAgendaRecurrence(
  //   data: InsertAgendaRecurrence
  // ): PromiseResult<SelectAgendaRecurrence, Error>;

  // update(data: UpdateAgenda): PromiseResult<undefined, Error>;
  // updateAgendaBooking(
  //   data: UpdateAgendaBooking
  // ): PromiseResult<undefined, Error>;
  // updateAgendaRecurrence(
  //   data: UpdateAgendaRecurrence
  // ): PromiseResult<undefined, Error>;
  // updateAgendaBookingParticipant(
  //   data: UpdateAgendaBookingParticipant
  // ): PromiseResult<undefined, Error>;
  // updateAgendaBookingById(
  //   data: UpdateAgendaBookingById
  // ): PromiseResult<undefined, Error>;

  // delete(data: DeleteAgenda): PromiseResult<undefined, Error>;
  // deleteAgendaRecurrence(
  //   id: SelectAgendaRecurrence['id']
  // ): PromiseResult<undefined, Error>;
  // deleteAgendaBooking(data: DeleteParticipant): PromiseResult<undefined, Error>;
  // cancel(data: CancelAgenda): PromiseResult<undefined, Error>;
}
