import { Insertable, Selectable, Updateable } from 'kysely';
import {
  AgendaBookings,
  Agendas,
  ClassTypes,
  Classes,
  Coaches,
  LocationFacilities,
  Locations,
  Users,
} from '../db';
import { DefaultPagination, OptionalToRequired, SelectLocation } from '.';

export interface FindAllAgendaOptions extends DefaultPagination {
  className?: string;
  coaches?: number[];
  locations: number[];
  dateStart?: Date;
  dateEnd?: Date;
}

export interface FindScheduleByDateOptions extends DefaultPagination {
  coaches?: number[];
  locations: number[];
  classTypes?: number[];
  classNames?: number[];
  date?: Date;
}

export interface FindAgendaByUserOptions extends DefaultPagination {
  coaches?: number[];
  locations: number[];
  classTypes?: number[];
  userId: Selectable<Users>['id'];
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
  'created_at' | 'updated_at' | 'updated_by'
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

interface SelectAgendaByUser
  extends SelectAgendaWithoutGenerated,
    SelectLocationAgenda,
    SelectCoachAgenda,
    SelectClassAgenda {
  agenda_booking_status: Selectable<AgendaBookings>['status'];
  agenda_booking_updated_at: Selectable<AgendaBookings>['updated_at'];
  location_facility_name: Selectable<LocationFacilities>['name'];
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
export type InsertAgendaBooking = Insertable<AgendaBookings>;

export type UpdateAgenda = OptionalToRequired<Updateable<Agendas>, 'id'>;

export interface UpdateAgendaBooking {
  agenda_id: SelectAgenda['id'];
  agendaBookings: Updateable<AgendaBookings>[];
}
export interface AgendaRepository {
  findAll(data: FindAllAgendaOptions): Promise<SelectAllAgenda>;
  findById(id: SelectAgenda['id']): Promise<SelectAgenda | undefined>;
  findScheduleById(
    id: SelectAgenda['id']
  ): Promise<SelectScheduleByDate | undefined>;
  findScheduleByDate(
    data: FindScheduleByDateOptions
  ): Promise<SelectAllSchedule>;
  findAgendaByUserId(
    data: FindAgendaByUserOptions
  ): Promise<SelectAllAgendaByUser>;
  create(data: InsertAgenda): Promise<SelectAgenda | Error>;
  // createParticipant(
  //   data: InsertAgendaBooking
  // ): Promise<SelectAgendaBooking | Error>;

  update(data: UpdateAgenda): Promise<undefined | Error>;
  updateAgendaBooking(data: UpdateAgendaBooking): Promise<undefined | Error>;

  delete(id: SelectAgenda['id']): Promise<undefined | Error>;
  // deleteParticipant(id: InsertAgendaBooking['id']): Promise<undefined | Error>;
}
