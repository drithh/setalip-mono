import { Database, Vouchers } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  VoucherRepository,
  InsertVoucher,
  SelectVoucher,
  UpdateVoucher,
  FindAllVoucherOptions,
  FindVoucherByCode,
} from '../voucher';

@injectable()
export class KyselyMySqlVoucherRepository implements VoucherRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('vouchers')
      .select(({ fn }) => [fn.count<number>('vouchers.id').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll(data: FindAllVoucherOptions) {
    const { page = 1, perPage = 10, sort, name, code, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectVoucher} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('vouchers')
      .leftJoin('users', 'vouchers.user_id', 'users.id');

    if (name) {
      query = query.where('users.name', 'like', `%${name}%`);
    }

    if (code) {
      query = query.where('vouchers.code', 'like', `%${code}%`);
    }

    if (types && types.length > 0) {
      query = query.where('vouchers.type', 'in', types);
    }

    const queryData = await query
      .selectAll(['vouchers'])
      .select(['users.name'])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('vouchers.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount,
    };
  }

  async findByUserId(userId: SelectVoucher['user_id']) {
    return this._db
      .selectFrom('vouchers')
      .selectAll()
      .where('vouchers.user_id', '=', userId)
      .executeTakeFirst();
  }

  findById(id: SelectVoucher['id']) {
    return this._db
      .selectFrom('vouchers')
      .selectAll()
      .where('vouchers.id', '=', id)
      .executeTakeFirst();
  }

  findByCodeAndUser(data: FindVoucherByCode) {
    return (
      this._db
        .selectFrom('vouchers')
        .selectAll()
        .where('vouchers.code', '=', data.code)
        .where((eb) =>
          eb.or([
            eb('vouchers.user_id', '=', null),
            eb('vouchers.user_id', '=', data.user_id),
          ])
        )
        // .where((eb) =>
        //   eb.or([
        //     eb('vouchers.user_id', '=', null),
        //     eb('vouchers.user_id', '=', data.user_id),
        //   ])
        // )
        .where('vouchers.expired_at', '>', new Date())
        .executeTakeFirst()
    );
  }

  async create(data: InsertVoucher) {
    try {
      const query = this._db
        .insertInto('vouchers')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create voucher', result);
        return new Error('Failed to create voucher');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating voucher:', error);
      return new Error('Failed to create voucher');
    }
  }

  async update(data: UpdateVoucher) {
    try {
      const query = await this._db
        .updateTable('vouchers')
        .set(data)
        .where('vouchers.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update voucher', query);
        return new Error('Failed to update voucher');
      }

      return;
    } catch (error) {
      console.error('Error updating voucher:', error);
      return new Error('Failed to update voucher');
    }
  }

  async delete(id: SelectVoucher['id']) {
    try {
      const query = await this._db
        .deleteFrom('vouchers')
        .where('vouchers.id', '=', id)
        .executeTakeFirst();

      if (query.numDeletedRows === undefined) {
        console.error('Failed to delete voucher', query);
        return new Error('Failed to delete voucher');
      }

      return;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      return new Error('Failed to delete voucher');
    }
  }
}
