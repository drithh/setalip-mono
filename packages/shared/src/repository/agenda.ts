import { Insertable, Selectable, Updateable } from 'kysely';
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

export type SelectAgendaBookngReturn<T extends SelectAgendaBookingQuery> =
  SelectAgendaBooking;
// (T['withAgendaBooking'] extends true ? AgendaWithAgendaBooking : {}) &
// (T['withClass'] extends true ? AgendaWithClass : {}) &
// (T['withCoach'] extends true ? AgendaWithCoach : {}) &
// (T['withLocation'] extends true ? AgendaWithLocation : {}) &
// (T['withCountParticipant'] extends true
//   ? { participant: number | null }
//   : {}) &
// (T['withParticipant'] extends true
//   ? { participants: AgendaWithParticipant[] | null }
//   : {});

export interface SelectAgendaBookingPagination<
  T extends SelectAgendaBookingQuery,
> {
  data: SelectAgendaBookngReturn<T>[];
  pageCount: number;
}
export interface SelectAgendaRecurrencePagination<
  T extends SelectAgendaRecurrence,
> {
  data: T[];
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

export interface SelectAgendaQueryWithBackfill {
  withBackfillAgenda: true;
  date: Date;
}

export interface SelectAgendaQueryWithoutBackfill {
  withBackfillAgenda?: false | undefined;
  date?: undefined;
}

export type SelectAgendaQuery = SelectAgendaQueryBase &
  (SelectAgendaQueryWithBackfill | SelectAgendaQueryWithoutBackfill);

export interface SelectAgendaBookingQuery extends Query<SelectAgendaBooking> {}
export interface SelectAgendaRecurrenceQuery
  extends Query<SelectAgendaRecurrence> {}

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

// export interface InsertAgendaBooking {
//   agenda_id?: SelectAgendaBooking['agenda_id'];
//   user_id: SelectAgendaBooking['user_id'];
//   time: SelectAgenda['time'];
//   agenda_recurrence_id?: SelectAgenda['agenda_recurrence_id'];
// }

// export interface InsertAgendaBookingByAdmin extends InsertAgendaBooking {
//   used_credit_user_id: SelectAgendaBooking['user_id'];
// }

// export interface InsertAgendaAndTransaction
//   extends Insertable<AgendaBookings>,
//     InsertCredit {}

// export interface InsertAgendaBookingAndTransactionByAdmin
//   extends InsertAgendaAndTransaction {
//   used_credit_user_id: SelectAgendaBooking['user_id'];
// }

// export type UpdateAgenda = Updateable<Agendas>;

// type UpdateAgendaBookingData = OptionalToRequired<
//   Updateable<AgendaBookings>,
//   'user_id'
// >;

// export type UpdateAgendaBookingById = OptionalToRequired<
//   Updateable<AgendaBookings>,
//   'id'
// >;

// export interface UpdateAgendaBooking {
//   agenda_id: SelectAgenda['id'];
//   agendaBookings: UpdateAgendaBookingData[];
// }

// export interface UpdateParticipant extends SelectParticipant {
//   id?: SelectAgendaBooking['id'];
//   delete: 'refund' | 'no_refund' | undefined;
// }

// export interface DeleteParticipant {
//   id: SelectAgendaBooking['id'];
//   type: 'refund' | 'no_refund';
// }

// export interface UpdateAgendaBookingParticipant {
//   agenda_id: SelectAgenda['id'];
//   agendaBookings: UpdateParticipant[];
// }

// export interface SelectBookingParticipant {
//   id: SelectAgendaBooking['id'];
//   status: SelectAgendaBooking['status'];
//   name: SelectUser['name'];
// }

// export interface DeleteAgenda {
//   id?: SelectAgenda['id'];
//   agenda_recurrence_id: SelectAgenda['agenda_recurrence_id'] | null;
//   time: SelectAgenda['time'];
//   coach_id: SelectCoach['id'];
//   location_facility_id: SelectLocation['id'];
//   class_id: SelectClassAgenda['class_id'];
//   is_refund: boolean;
// }

// export interface CancelAgenda {
//   agenda_booking_id: SelectAgendaBooking['id'];
//   user_id: SelectUser['id'];
// }

// export interface SelectAgendaRecurrenceWithCoachAndClass
//   extends SelectAgendaRecurrence,
//     SelectCoachAgenda,
//     SelectClassAgenda,
//     SelectLocationAgenda {}

// export interface SelectAllAgendaRecurrence {
//   data: SelectAgendaRecurrenceWithCoachAndClass[];
//   pageCount: number;
// }

// export interface SelectAgendaBookingWithIncome {
//   class_type_id: SelectClassType['id'];
//   class_type_name: SelectClassType['type'];
//   participant: number;
//   income: number;
// }

// export interface TotalCoachAgenda {
//   class_type_id: SelectClassType['id'];
//   class_type_name: SelectClassType['type'];
//   total: number;
// }

// export interface SelectCoachAgendaBooking {
//   coach_id: SelectCoach['id'];
//   coach_name: SelectUser['name'];
//   agenda: TotalCoachAgenda[];
//   agenda_count: number;
// }

export interface AgendaRepository {
  count(): Promise<number>;
  // countParticipant(id: SelectAgenda['id']): Promise<number>;
  // countCheckedInByUserId(userId: SelectUser['id']): Promise<number | undefined>;
  // countCoachAgenda(userId: SelectCoach['user_id']): Promise<number>;

  find<T extends SelectAgendaQuery>(x: T): Promise<SelectAgendaReturn<T>[]>;

  findWithPagination<T extends SelectAgendaQuery>(
    data?: T
  ): Promise<SelectAgendaPagination<T>>;

  findAgendaBooking<T extends SelectAgendaBookingQuery>(data?: T): Promise<T[]>;
  findAgendaBookingWithPagination<T extends SelectAgendaBookingQuery>(
    data?: T
  ): Promise<SelectAgendaBookingPagination<T>>;

  findAgendaRecurrence<T extends SelectAgendaRecurrence>(
    data?: SelectAgendaRecurrenceQuery
  ): Promise<T[]>;
  findAgendaRecurrenceWithPagination<T extends SelectAgendaRecurrence>(
    data?: SelectAgendaRecurrenceQuery
  ): Promise<SelectAgendaRecurrencePagination<T>>;

  // findAll(data: FindAllAgendaOptions): Promise<SelectAllAgenda>;
  // findById(id: SelectAgenda['id']): Promise<SelectAgenda | undefined>;
  // findAllAgendaBookingByMonthAndLocation(
  //   data: FindAllAgendaBookingByMonthAndLocation
  // ): Promise<SelectAgendaBookingWithIncome[]>;
  // findAllCoachAgendaByMonthAndLocation(
  //   data: FindAllAgendaBookingByMonthAndLocation
  // ): Promise<SelectCoachAgendaBooking[]>;
  // findAgendaRecurrenceById(
  //   id: SelectAgendaRecurrence['id']
  // ): Promise<SelectAgendaRecurrence | undefined>;
  // findAllAgendaRecurrence(
  //   data: FindAllAgendaRecurrenceOption
  // ): Promise<SelectAllAgendaRecurrence>;
  // findAllAgendaRecurrenceByDay(
  //   day: SelectAgendaRecurrence['day_of_week']
  // ): Promise<SelectAgendaRecurrence[]>;
  // findAllAgendaBookingByAgendaId(
  //   id: SelectAgenda['id']
  // ): Promise<SelectAgendaBooking[]>;
  // findAgendaBookingById(
  //   id: SelectAgendaBooking['id']
  // ): Promise<SelectAgendaBooking | undefined>;
  // findAllParticipantByAgendaId(
  //   id: SelectAgenda['id']
  // ): Promise<SelectBookingParticipant[]>;
  // findTodayScheduleByCoachId(
  //   coachUserId: SelectCoach['user_id']
  // ): Promise<SelectScheduleByDate[]>;
  // findAllByCoachId(
  //   data: FindAllAgendaByCoachOptions
  // ): Promise<SelectAllSchedule>;
  // findScheduleById(
  //   data: FindScheduleByIdOptions
  // ): Promise<SelectScheduleByDate | undefined>;
  // findScheduleByDate(
  //   data: FindScheduleByDateOptions
  // ): Promise<SelectAllSchedule>;
  // findByUserId(
  //   data: FindAgendaByUserOptions
  // ): Promise<SelectAllAgendaByUser>;
  // findActiveAgendaByUserId(
  //   data: SelectUser['id']
  // ): Promise<SelectAgendaByUser[]>;

  // create(data: InsertAgenda): Promise<SelectAgenda | Error>;
  // createAgendaRecurrence(
  //   data: InsertAgendaRecurrence
  // ): Promise<SelectAgendaRecurrence | Error>;
  // createAgendaBooking(
  //   data: InsertAgendaAndTransaction
  // ): Promise<SelectAgendaBooking | Error>;
  // createAgendaBookingByAdmin(
  //   data: InsertAgendaBookingAndTransactionByAdmin
  // ): Promise<SelectAgendaBooking | Error>;

  // update(data: UpdateAgenda): Promise<undefined | Error>;
  // updateAgendaRecurrence(
  //   data: UpdateAgendaRecurrence
  // ): Promise<undefined | Error>;
  // updateAgendaBooking(data: UpdateAgendaBooking): Promise<undefined | Error>;
  // updateAgendaBookingParticipant(
  //   data: UpdateAgendaBookingParticipant
  // ): Promise<undefined | Error>;
  // updateAgendaBookingById(
  //   data: UpdateAgendaBookingById
  // ): Promise<undefined | Error>;

  // delete(data: DeleteAgenda): Promise<undefined | Error>;
  // deleteAgendaRecurrence(
  //   id: SelectAgendaRecurrence['id']
  // ): Promise<undefined | Error>;
  // cancel(data: CancelAgenda): Promise<undefined | Error>;
  // deleteAgendaBooking(id: DeleteParticipant): Promise<undefined | Error>;
}
