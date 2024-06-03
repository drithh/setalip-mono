import {
  SelectAgenda,
  InsertAgenda,
  UpdateAgenda,
  FindAllAgendaOptions,
  SelectAllAgenda,
  SelectAgendaBooking,
  InsertAgendaBooking,
} from '../repository';
import { PromiseResult } from '../types';

export interface AgendaService {
  findAll(data: FindAllAgendaOptions): PromiseResult<SelectAllAgenda, Error>;
  findById(
    id: SelectAgenda['id']
  ): PromiseResult<SelectAgenda | undefined, Error>;

  create(data: InsertAgenda): PromiseResult<SelectAgenda, Error>;
  createParticipant(
    data: InsertAgendaBooking
  ): PromiseResult<SelectAgendaBooking, Error>;

  update(data: UpdateAgenda): PromiseResult<undefined, Error>;

  delete(id: SelectAgenda['id']): PromiseResult<undefined, Error>;
  deleteParticipant(
    id: SelectAgendaBooking['id']
  ): PromiseResult<undefined, Error>;
}
