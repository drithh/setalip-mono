import {
  SelectVoucher,
  InsertVoucher,
  UpdateVoucher,
  SelectVoucherWithUser,
  SelectAllVoucher,
  FindAllVoucherOptions,
  FindVoucherByCode,
  // FindAllVoucherOptions,
  // SelectAllVoucher,
} from '../repository';
import { PromiseResult } from '../types';

export interface VoucherService {
  findAll(data: FindAllVoucherOptions): PromiseResult<SelectAllVoucher, Error>;
  findById(
    id: SelectVoucher['id']
  ): PromiseResult<SelectVoucher | undefined, Error>;
  findByUserId(
    userId: SelectVoucher['user_id']
  ): PromiseResult<SelectVoucher | undefined, Error>;
  findByCodeAndUser(
    data: FindVoucherByCode
  ): PromiseResult<SelectVoucher | undefined, Error>;

  create(data: InsertVoucher): PromiseResult<SelectVoucher, Error>;

  update(data: UpdateVoucher): PromiseResult<undefined, Error>;

  delete(id: SelectVoucher['id']): PromiseResult<undefined, Error>;
}
