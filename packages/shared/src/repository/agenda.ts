import { Insertable, Selectable, Updateable } from 'kysely';
import { AgendaBookings, Agendas, Classes, Coaches, Users } from '../db';
import { DefaultPagination, OptionalToRequired } from '.';

export interface FindAllAgendaOptions extends DefaultPagination {
  coach?: string;
  className?: string;
  locations: number[];
  dateStart?: Date;
  dateEnd?: Date;
}

export interface SelectAllAgenda {
  data: SelectAgendaWithCoachAndClass[];
  pageCount: number;
}

type SelectCoachName = { coach_name: Selectable<Users>['name'] };
type SelectClass = {
  class_name: Selectable<Classes>['name'];
  class_duration: Selectable<Classes>['duration'];
};

type Participant = {
  id: Selectable<AgendaBookings>['id'];
  name: Selectable<Users>['name'];
};

export interface SelectAgendaWithCoachAndClass
  extends SelectAgenda,
    SelectCoachName,
    SelectClass {
  participants: Participant[];
}

export type SelectAgenda = Selectable<Agendas>;
export type SelectAgendaBooking = Selectable<AgendaBookings>;

export type InsertAgenda = Insertable<Agendas>;
export type InsertAgendaBooking = Insertable<AgendaBookings>;

export type UpdateAgenda = OptionalToRequired<Updateable<Agendas>, 'id'>;

export interface AgendaRepository {
  findAll(data: FindAllAgendaOptions): Promise<SelectAllAgenda>;
  findById(id: SelectAgenda['id']): Promise<SelectAgenda | undefined>;

  create(data: InsertAgenda): Promise<SelectAgenda | Error>;
  createParticipant(
    data: InsertAgendaBooking
  ): Promise<SelectAgendaBooking | Error>;

  update(data: UpdateAgenda): Promise<undefined | Error>;

  delete(id: SelectAgenda['id']): Promise<undefined | Error>;
  deleteParticipant(id: InsertAgendaBooking['id']): Promise<undefined | Error>;
}
