import { Insertable, Selectable, Updateable } from 'kysely';
import { Vouchers } from '../db';
import { DefaultPagination, OptionalToRequired, SelectUser } from '.';

export type SelectVoucher = Selectable<Vouchers>;
export type SelectVoucherWithUser = SelectVoucher & {
  name: SelectUser['name'] | null;
};

export interface SelectAllVoucher {
  data: SelectVoucherWithUser[];
  pageCount: number;
}

export type InsertVoucher = Insertable<Vouchers>;
export type UpdateVoucher = OptionalToRequired<Updateable<Vouchers>, 'id'>;

export interface FindAllVoucherOptions extends DefaultPagination {
  name?: SelectUser['name'];
  code?: SelectVoucher['code'];
  types?: SelectVoucher['type'][];
}

export interface VoucherRepository {
  count(): Promise<number>;

  findAll(data: FindAllVoucherOptions): Promise<SelectAllVoucher>;
  findById(id: SelectVoucher['id']): Promise<SelectVoucher | undefined>;
  findByUserId(
    userId: SelectVoucher['user_id']
  ): Promise<SelectVoucher | undefined>;

  create(data: InsertVoucher): Promise<SelectVoucher | Error>;

  update(data: UpdateVoucher): Promise<undefined | Error>;

  delete(id: SelectVoucher['id']): Promise<undefined | Error>;
}
