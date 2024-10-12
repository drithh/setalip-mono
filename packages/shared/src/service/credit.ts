import {
  SelectCredit,
  InsertCredit,
  UpdateCredit,
  FindAllCreditOptions,
  SelectCreditPagination,
} from '../repository';
import { PromiseResult } from '../types';

export interface CreditService {
  findAll(): PromiseResult<SelectCredit[], Error>;
  findById(
    id: SelectCredit['id']
  ): PromiseResult<SelectCredit | undefined, Error>;

  findByUserPackageId(
    id: SelectCredit['user_package_id']
  ): PromiseResult<SelectCredit | undefined, Error>;
  findAllByUserId(
    data: FindAllCreditOptions
  ): PromiseResult<SelectCreditPagination, Error>;

  create(data: InsertCredit): PromiseResult<SelectCredit, Error>;

  update(data: UpdateCredit): PromiseResult<undefined, Error>;

  deleteByAgendaBookingId(
    agendaBookingId: SelectCredit['agenda_booking_id']
  ): PromiseResult<undefined, Error>;
}
