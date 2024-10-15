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
  InsertAgendaCommand,
  InsertAgendaBookingCommand,
} from '../repository';
import { PromiseResult } from '../types';
import { FindAllIncomeByMonthAndLocationOption } from './class-type';
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

export interface TotalCoachAgenda {
  class_type_id: SelectClassType['id'];
  class_type_name: SelectClassType['type'];
  total: number;
}

export interface SelectCoachAgendaBooking {
  coach_id: SelectCoach['id'];
  coach_name: SelectUser['name'];
  agenda: TotalCoachAgenda[];
  agenda_count: number;
}

export interface FindAllAgendaRecurrenceOption extends DefaultPagination {
  coaches?: SelectCoach['id'][];
  locations?: SelectLocation['id'][];
  day_of_week: number;
}

export interface InsertAgendaBookingOption {
  agenda_id?: SelectAgendaBooking['agenda_id'];
  user_id: SelectAgendaBooking['user_id'];
  time: SelectAgenda['time'];
  agenda_recurrence_id?: SelectAgenda['agenda_recurrence_id'];
}

export interface InsertAgendaBookingByAdminOption
  extends InsertAgendaBookingOption {
  used_credit_user_id: SelectAgendaBooking['user_id'];
}

export interface SelectAgendaRecurrence__Coach__Class__Location
  extends SelectAgendaRecurrence,
    AgendaWithLocation,
    AgendaWithCoach,
    AgendaWithClass {}

export interface DeleteAgenda extends UpdateAgenda {
  is_refund: boolean;
}

export interface CancelAgendaBookingByAdminOption {
  id: SelectAgendaBooking['id'];
  type: 'refund' | 'no_refund';
}

export interface CancelAgendaBookingByUserOption {
  id: SelectAgendaBooking['id'];
  user_id: SelectUser['id'];
}

export interface FindAllAgendaBookingByMonthAndLocation {
  date: Date;
  location_id: number;
}

export interface AgendaService {
  count(): Promise<number>;

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

  findAllAgendaBookingByAgendaId(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgendaBooking[], Error>;
  findAgendaBookingById(
    id: SelectAgendaBooking['id']
  ): PromiseResult<SelectAgendaBooking | undefined, Error>;

  findAllAgendaRecurrence(
    data: FindAllAgendaRecurrenceOption
  ): PromiseResult<
    DefaultReturn<SelectAgendaRecurrence__Coach__Class__Location>,
    Error
  >;
  findAgendaRecurrenceById(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<SelectAgendaRecurrence, Error>;

  create(data: InsertAgendaCommand): PromiseResult<SelectAgenda, Error>;
  createAgendaBooking(
    data: InsertAgendaBookingOption
  ): PromiseResult<SelectAgendaBooking, Error>;
  createAgendaBookingByAdmin(
    data: InsertAgendaBookingByAdminOption
  ): PromiseResult<SelectAgendaBooking, Error>;
  createAgendaRecurrence(
    data: InsertAgendaRecurrence
  ): PromiseResult<SelectAgendaRecurrence, Error>;

  update(data: UpdateAgenda): PromiseResult<null, Error>;
  updateAgendaBookingById(
    data: UpdateAgendaBooking
  ): PromiseResult<null, Error>;
  updateAgendaRecurrence(
    data: UpdateAgendaRecurrence
  ): PromiseResult<null, Error>;

  delete(data: DeleteAgenda): PromiseResult<null, Error>;
  deleteAgendaRecurrence(
    id: SelectAgendaRecurrence['id']
  ): PromiseResult<null, Error>;
  cancelAgendaBookingByAdmin(
    data: CancelAgendaBookingByAdminOption
  ): PromiseResult<null, Error>;
  cancelAgendaBookingByUser(
    data: CancelAgendaBookingByUserOption
  ): PromiseResult<null, Error>;

  findAllCoachAgendaByMonthAndLocation(
    data: FindAllIncomeByMonthAndLocationOption
  ): PromiseResult<SelectCoachAgendaBooking[], Error>;
}
