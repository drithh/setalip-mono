import {
  Expression,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import {
  AgendaBookings,
  AgendaRecurrences,
  Agendas,
  ClassTypes,
  Classes,
  Coaches,
  Command,
  LocationFacilities,
  Locations,
  Query,
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
import {
  AgendaWithAgendaBooking,
  AgendaWithClass,
  AgendaWithCoach,
  AgendaWithLocation,
  AgendaWithParticipant,
} from '../service';

// export interface FindAllAgendaRecurrenceOption extends DefaultPagination {
//   coaches?: number[];
//   locations?: number[];
//   day_of_week: number;
// }

// type Nullable<T> = {
//   [P in keyof T]: T[P] | null;
// };

// export interface SelectAllSchedule {
//   data: SelectScheduleByDate[];
//   pageCount: number;
// }

// export interface SelectAllAgendaByUser {
//   data: SelectAgendaByUser[];
//   pageCount: number;
// }

export type SelectAgenda = Selectable<Agendas>;
export type SelectAgendaBooking = Selectable<AgendaBookings>;
export type SelectAgendaRecurrence = Selectable<AgendaRecurrences>;

export type SelectAgendaReturn<T extends SelectAgendaQuery> = SelectAgenda &
  (T['withAgendaBooking'] extends true ? AgendaWithAgendaBooking : {}) &
  (T['withClass'] extends true ? AgendaWithClass : {}) &
  (T['withCoach'] extends true ? AgendaWithCoach : {}) &
  (T['withLocation'] extends true ? AgendaWithLocation : {}) &
  (T['withCountParticipant'] extends true
    ? { participant: number | null }
    : {}) &
  (T['withParticipant'] extends true
    ? { participants: AgendaWithParticipant[] | null }
    : {});

export interface SelectAgendaPagination<T extends SelectAgendaQuery> {
  data: SelectAgendaReturn<T>[];
  pageCount: number;
}

export type SelectAgendaBookingReturn<T extends SelectAgendaBookingQuery> =
  SelectAgendaBooking;

export interface SelectAgendaBookingPagination<
  T extends SelectAgendaBookingQuery,
> {
  data: SelectAgendaBookingReturn<T>[];
  pageCount: number;
}

export type SelectAgendaRecurrenceReturn<
  T extends SelectAgendaRecurrenceQuery,
> = SelectAgendaRecurrence &
  (T['withClass'] extends true ? AgendaWithClass : {}) &
  (T['withCoach'] extends true ? AgendaWithCoach : {}) &
  (T['withLocation'] extends true ? AgendaWithLocation : {});

export interface SelectAgendaRecurrencePagination<
  T extends SelectAgendaRecurrenceQuery,
> {
  data: SelectAgendaRecurrenceReturn<T>[];
  pageCount: number;
}

export interface SelectAgendaQueryBase extends Query<SelectAgenda> {
  withLocation?: boolean;
  withCoach?: boolean;
  withClass?: boolean;
  withAgendaBooking?: boolean;

  withParticipant?: boolean;
  withCountParticipant?: boolean;
}

export interface BackFillProps {
  date: Date;
  agendaReccurenceFilter: Expression<SqlBool>[];
  agendaFilter: Expression<SqlBool>[];
  unionFilter: Expression<SqlBool>[];
}

export interface SelectAgendaQueryWithBackfill {
  withBackfillAgenda: true;
  backfillProps: BackFillProps;
}

export interface SelectAgendaQueryWithoutBackfill {
  withBackfillAgenda?: false | undefined;
  backfillProps?: never;
}

export type SelectAgendaQuery = SelectAgendaQueryBase &
  (SelectAgendaQueryWithBackfill | SelectAgendaQueryWithoutBackfill);

export interface SelectAgendaBookingQuery extends Query<SelectAgendaBooking> {}
export interface SelectAgendaRecurrenceQuery
  extends Query<SelectAgendaRecurrence> {
  withLocation?: boolean;
  withCoach?: boolean;
  withClass?: boolean;
}

export type InsertAgenda = Insertable<Agendas>;
export type InsertAgendaBooking = Insertable<AgendaBookings>;
export type InsertAgendaRecurrence = Insertable<AgendaRecurrences>;

export interface InsertAgendaCommand extends Command<SelectAgenda> {
  data: InsertAgenda;
}
export interface InsertAgendaBookingCommand
  extends Command<SelectAgendaBooking> {
  data: InsertAgendaBooking;
}
export interface InsertAgendaRecurrenceCommand
  extends Command<SelectAgendaRecurrence> {
  data: InsertAgendaRecurrence;
}

export type UpdateAgenda = Updateable<Agendas>;
export type UpdateAgendaBooking = Updateable<AgendaBookings>;
export type UpdateAgendaRecurrence = Updateable<AgendaRecurrences>;

export interface UpdateAgendaCommand extends Command<SelectAgenda> {
  data: UpdateAgenda;
}
export interface UpdateAgendaBookingCommand
  extends Command<SelectAgendaBooking> {
  data: UpdateAgendaBooking;
}
export interface UpdateAgendaRecurrenceCommand
  extends Command<SelectAgendaRecurrence> {
  data: UpdateAgendaRecurrence;
}

export type DeleteAgendaCommand = Command<SelectAgenda>;
export type DeleteAgendaBookingCommand = Command<SelectAgendaBooking>;
export type DeleteAgendaRecurrenceCommand = Command<SelectAgendaRecurrence>;

export interface AgendaRepository {
  count(): Promise<number>;

  find<T extends SelectAgendaQuery>(data: T): Promise<SelectAgendaReturn<T>[]>;
  findWithPagination<T extends SelectAgendaQuery>(
    data?: T
  ): Promise<SelectAgendaPagination<T>>;

  findAgendaBooking<T extends SelectAgendaBookingQuery>(
    data?: T
  ): Promise<SelectAgendaBookingReturn<T>[]>;
  findAgendaBookingWithPagination<T extends SelectAgendaBookingQuery>(
    data?: T
  ): Promise<SelectAgendaBookingPagination<T>>;

  findAgendaRecurrence<T extends SelectAgendaRecurrenceQuery>(
    data?: T
  ): Promise<SelectAgendaRecurrenceReturn<T>[]>;
  findAgendaRecurrenceWithPagination<T extends SelectAgendaRecurrenceQuery>(
    data?: T
  ): Promise<SelectAgendaRecurrencePagination<T>>;

  create(data: InsertAgendaCommand): Promise<SelectAgenda | Error>;
  createAgendaBooking(
    data: InsertAgendaBookingCommand
  ): Promise<SelectAgendaBooking | Error>;
  createAgendaRecurrence(
    data: InsertAgendaRecurrenceCommand
  ): Promise<SelectAgendaRecurrence | Error>;

  update(data: UpdateAgendaCommand): Promise<undefined | Error>;
  updateAgendaBooking(
    data: UpdateAgendaBookingCommand
  ): Promise<undefined | Error>;
  updateAgendaRecurrence(
    data: UpdateAgendaRecurrenceCommand
  ): Promise<undefined | Error>;

  delete(data: DeleteAgendaCommand): Promise<undefined | Error>;
  deleteAgendaRecurrence(
    data: DeleteAgendaRecurrenceCommand
  ): Promise<undefined | Error>;
}
