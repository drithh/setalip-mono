import { Insertable, Selectable, Updateable } from 'kysely';
import {
  AgendaBookings,
  AgendaRecurrences,
  Agendas,
  ClassTypes,
  Classes,
  Coaches,
  LocationFacilities,
  Locations,
  Users,
} from '../db';
import {
  DefaultPagination,
  InsertCredit,
  OptionalToRequired,
  SelectClassType,
  SelectCoach,
  SelectLocation,
  SelectUser,
} from '.';

export interface FindAllAgendaOptions extends DefaultPagination {
  className?: string;
  coaches?: number[];
  locations: number[];
  date: Date;
}

export interface FindScheduleByDateOptions extends DefaultPagination {
  coaches?: number[];
  locations?: number[];
  classTypes?: number[];
  classNames?: number[];
  date: Date;
}

export interface FindAllAgendaByCoachOptions extends DefaultPagination {
  locations: number[];
  classTypes?: number[];
  date?: Date;
  coachUserId: Selectable<Coaches>['user_id'];
}

export interface FindAgendaByUserOptions extends DefaultPagination {
  coaches?: number[];
  locations: number[];
  classTypes?: number[];
  userId: Selectable<Users>['id'];
}

export interface FindAllAgendaRecurrenceOption extends DefaultPagination {
  coaches?: number[];
  locations?: number[];
  day_of_week: number;
}

export interface SelectAllAgenda {
  data: SelectAgendaWithCoachAndClass[];
  pageCount: number;
}

export type SelectCoachAgenda = {
  coach_name: Selectable<Users>['name'];
  coach_id: Selectable<Coaches>['id'];
};

export type SelectClassAgenda = {
  class_id: Selectable<Classes>['id'];
  class_name: Selectable<Classes>['name'];
  class_type_id: Selectable<ClassTypes>['id'];
  class_type_name: Selectable<ClassTypes>['type'];
  class_duration: Selectable<Classes>['duration'];
  slot: Selectable<Classes>['slot'];
};

export type SelectParticipant = {
  user_id: Selectable<Users>['id'];
  agenda_booking_id?: Selectable<AgendaBookings>['id'];
  name: Selectable<Users>['name'];
};

export type SelectLocationAgenda = {
  location_name: SelectLocation['name'];
  location_id: SelectLocation['id'];
};

type SelectAgendaWithoutGenerated = Omit<
  SelectAgenda,
  'created_at' | 'updated_at' | 'updated_by' | 'is_show' | 'deleted_at'
>;

export interface SelectAgendaWithCoachAndClass
  extends SelectAgenda,
    SelectCoachAgenda,
    SelectClassAgenda,
    SelectLocationAgenda {
  participants: SelectParticipant[] | null;
  // location_facility: SelectLocationFacilityAgenda;
}

export interface SelectScheduleByDate
  extends SelectAgendaWithoutGenerated,
    SelectLocationAgenda,
    SelectCoachAgenda,
    SelectClassAgenda {
  participant: number | null;
  location_facility_name: Selectable<LocationFacilities>['name'];
  location_link_maps: SelectLocation['link_maps'];
  location_address: SelectLocation['address'];
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
interface SelectAgendaByUser
  extends Nullable<SelectAgendaWithoutGenerated>,
    Nullable<SelectLocationAgenda>,
    Nullable<SelectCoachAgenda>,
    Nullable<SelectClassAgenda> {
  agenda_booking_id: Selectable<AgendaBookings>['id'];
  agenda_booking_status: Selectable<AgendaBookings>['status'];
  agenda_booking_updated_at: Selectable<AgendaBookings>['updated_at'];
  location_facility_name: Selectable<LocationFacilities>['name'] | null;
}

export interface SelectAllSchedule {
  data: SelectScheduleByDate[];
  pageCount: number;
}

export interface SelectAllAgendaByUser {
  data: SelectAgendaByUser[];
  pageCount: number;
}

export type SelectAgenda = Selectable<Agendas>;
export type SelectAgendaBooking = Selectable<AgendaBookings>;

export type InsertAgenda = Insertable<Agendas>;

export interface InsertAgendaBooking {
  agenda_id?: SelectAgendaBooking['agenda_id'];
  user_id: SelectAgendaBooking['user_id'];
  time: SelectAgenda['time'];
  agenda_recurrence_id?: SelectAgenda['agenda_recurrence_id'];
}

export interface InsertAgendaBookingByAdmin extends InsertAgendaBooking {
  used_credit_user_id: SelectAgendaBooking['user_id'];
}

export interface InsertAgendaAndTransaction
  extends Insertable<AgendaBookings>,
    InsertCredit {}

export interface InsertAgendaBookingAndTransactionByAdmin
  extends InsertAgendaAndTransaction {
  used_credit_user_id: SelectAgendaBooking['user_id'];
}

export type UpdateAgenda = Updateable<Agendas>;

type UpdateAgendaBookingData = OptionalToRequired<
  Updateable<AgendaBookings>,
  'user_id'
>;

export type UpdateAgendaBookingById = OptionalToRequired<
  Updateable<AgendaBookings>,
  'id'
>;

export interface UpdateAgendaBooking {
  agenda_id: SelectAgenda['id'];
  agendaBookings: UpdateAgendaBookingData[];
}

export interface UpdateParticipant extends SelectParticipant {
  id?: SelectAgendaBooking['id'];
  delete: 'refund' | 'no_refund' | undefined;
}

export interface DeleteParticipant {
  id: SelectAgendaBooking['id'];
  type: 'refund' | 'no_refund';
}

export interface UpdateAgendaBookingParticipant {
  agenda_id: SelectAgenda['id'];
  agendaBookings: UpdateParticipant[];
}

export interface SelectBookingParticipant {
  id: SelectAgendaBooking['id'];
  status: SelectAgendaBooking['status'];
  name: SelectUser['name'];
}

export interface DeleteAgenda {
  id?: SelectAgenda['id'];
  agenda_recurrence_id: SelectAgenda['agenda_recurrence_id'] | null;
  time: SelectAgenda['time'];
  coach_id: SelectCoach['id'];
  location_facility_id: SelectLocation['id'];
  class_id: SelectClassAgenda['class_id'];
  is_refund: boolean;
}

export interface CancelAgenda {
  agenda_booking_id: SelectAgendaBooking['id'];
  user_id: SelectUser['id'];
}

export type SelectAgendaRecurrence = Selectable<AgendaRecurrences>;
export type InsertAgendaRecurrence = Insertable<AgendaRecurrences>;
export type UpdateAgendaRecurrence = OptionalToRequired<
  Updateable<AgendaRecurrences>,
  'id'
>;
export interface SelectAgendaRecurrenceWithCoachAndClass
  extends SelectAgendaRecurrence,
    SelectCoachAgenda,
    SelectClassAgenda,
    SelectLocationAgenda {}

export interface SelectAllAgendaRecurrence {
  data: SelectAgendaRecurrenceWithCoachAndClass[];
  pageCount: number;
}

export interface FindScheduleByIdOptions {
  id?: SelectAgenda['id'];
  agendaRecurrenceId?: SelectAgenda['agenda_recurrence_id'];
  time?: SelectAgenda['time'];
}

export interface FindAllAgendaBookingByMonthAndLocation {
  date: Date;
  location_id: number;
}
export interface SelectAgendaBookingWithIncome {
  class_type_id: SelectClassType['id'];
  class_type_name: SelectClassType['type'];
  participant: number;
  income: number;
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

export interface AgendaRepository {
  count(): Promise<number>;
  countParticipant(id: SelectAgenda['id']): Promise<number>;
  countCheckedInByUserId(userId: SelectUser['id']): Promise<number | undefined>;
  countCoachAgenda(userId: SelectCoach['user_id']): Promise<number>;

  findAll(data: FindAllAgendaOptions): Promise<SelectAllAgenda>;
  findById(id: SelectAgenda['id']): Promise<SelectAgenda | undefined>;
  findAllAgendaBookingByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ): Promise<SelectAgendaBookingWithIncome[]>;
  findAllCoachAgendaByMonthAndLocation(
    data: FindAllAgendaBookingByMonthAndLocation
  ): Promise<SelectCoachAgendaBooking[]>;
  findAgendaRecurrenceById(
    id: SelectAgendaRecurrence['id']
  ): Promise<SelectAgendaRecurrence | undefined>;
  findAllAgendaRecurrence(
    data: FindAllAgendaRecurrenceOption
  ): Promise<SelectAllAgendaRecurrence>;
  findAllAgendaRecurrenceByDay(
    day: SelectAgendaRecurrence['day_of_week']
  ): Promise<SelectAgendaRecurrence[]>;
  findAllAgendaBookingByAgendaId(
    id: SelectAgenda['id']
  ): Promise<SelectAgendaBooking[]>;
  findAgendaBookingById(
    id: SelectAgendaBooking['id']
  ): Promise<SelectAgendaBooking | undefined>;
  findAllParticipantByAgendaId(
    id: SelectAgenda['id']
  ): Promise<SelectBookingParticipant[]>;
  findTodayScheduleByCoachId(
    coachUserId: SelectCoach['user_id']
  ): Promise<SelectScheduleByDate[]>;
  findAllByCoachId(
    data: FindAllAgendaByCoachOptions
  ): Promise<SelectAllSchedule>;
  findScheduleById(
    data: FindScheduleByIdOptions
  ): Promise<SelectScheduleByDate | undefined>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): Promise<SelectAllSchedule>;
  findAgendaByUserId(
    data: FindAgendaByUserOptions
  ): Promise<SelectAllAgendaByUser>;
  findActiveAgendaByUserId(
    data: SelectUser['id']
  ): Promise<SelectAgendaByUser[]>;

  create(data: InsertAgenda): Promise<SelectAgenda | Error>;
  createAgendaRecurrence(
    data: InsertAgendaRecurrence
  ): Promise<SelectAgendaRecurrence | Error>;
  createAgendaBooking(
    data: InsertAgendaAndTransaction
  ): Promise<SelectAgendaBooking | Error>;
  createAgendaBookingByAdmin(
    data: InsertAgendaBookingAndTransactionByAdmin
  ): Promise<SelectAgendaBooking | Error>;

  update(data: UpdateAgenda): Promise<undefined | Error>;
  updateAgendaRecurrence(
    data: UpdateAgendaRecurrence
  ): Promise<undefined | Error>;
  updateAgendaBooking(data: UpdateAgendaBooking): Promise<undefined | Error>;
  updateAgendaBookingParticipant(
    data: UpdateAgendaBookingParticipant
  ): Promise<undefined | Error>;
  updateAgendaBookingById(
    data: UpdateAgendaBookingById
  ): Promise<undefined | Error>;

  delete(data: DeleteAgenda): Promise<undefined | Error>;
  deleteAgendaRecurrence(
    id: SelectAgendaRecurrence['id']
  ): Promise<undefined | Error>;
  cancel(data: CancelAgenda): Promise<undefined | Error>;
  deleteAgendaBooking(id: DeleteParticipant): Promise<undefined | Error>;
}
