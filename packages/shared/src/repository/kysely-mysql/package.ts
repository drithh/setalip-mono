import { inject, injectable } from 'inversify';
import {
  FindAllPackageOptions,
  FindAllUserPackageOption,
  InsertPackage,
  PackageRepository,
  SelectAllPackage,
  SelectPackage,
  SelectPackageTransaction,
  UpdatePackage,
} from '../package';
import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { sql } from 'kysely';

@injectable()
export class KyselyMySqlPackageRepository implements PackageRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findAll(data: FindAllPackageOptions) {
    const { page = 1, perPage = 10, sort, name, types } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackage} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('packages')
      .innerJoin('class_types', 'packages.class_type_id', 'class_types.id');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    if (types) {
      query = query.where('class_type_id', 'in', types);
    }
    const queryData = await query
      .selectAll('packages')
      .select('class_types.type as class_type')
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('packages.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  findById(id: SelectPackage['id']) {
    return this._db
      .selectFrom('packages')
      .selectAll()
      .where('packages.id', '=', id)
      .executeTakeFirst();
  }

  async findAllPackageTransactionByUserId(data: FindAllUserPackageOption) {
    const { page = 1, perPage = 10, sort, user_id, status } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectPackageTransaction} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('package_transactions')
      .innerJoin(
        'user_packages',
        'package_transactions.user_package_id',
        'user_packages.id'
      )
      .innerJoin('packages', 'user_packages.package_id', 'packages.id')
      .where('package_transactions.user_id', '=', user_id);

    if (status) {
      query = query.where('package_transactions.status', 'in', status);
    }

    const queryData = await query
      .selectAll('package_transactions')
      .select([
        'packages.name as package_name',
        'user_packages.expired_at as package_expired_at',
        'user_packages.credit as credit',
      ])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('package_transactions.id').as('count'),
      ])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  async findAllActivePackageByUserId(
    user_id: SelectPackageTransaction['user_id']
  ) {
    const query = this._db
      .selectFrom('user_packages')
      .innerJoin('packages', 'user_packages.package_id', 'packages.id')
      .where('user_packages.user_id', '=', user_id)
      .where('user_packages.expired_at', '>', new Date())
      .selectAll('user_packages')
      .select((eb) => [
        'packages.name as package_name',

        eb
          .selectFrom('credit_transactions')
          .where('credit_transactions.user_id', '=', user_id)
          .select(({ fn }) => [
            fn
              .coalesce(
                fn.sum<number | null>('credit_transactions.amount'),
                sql<number>`0`
              )
              .as('credit_used'),
          ])
          .as('credit_used'),
      ])
      .execute();

    return query;
  }

  async create(data: InsertPackage) {
    try {
      const query = this._db
        .insertInto('packages')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create package', result);
        return new Error('Failed to create package');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating package:', error);
      return new Error('Failed to create package');
    }
  }

  async update(data: UpdatePackage) {
    try {
      const query = await this._db
        .updateTable('packages')
        .set(data)
        .where('packages.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update package', query);
        return new Error('Failed to update package');
      }

      return;
    } catch (error) {
      console.error('Error updating package:', error);
      return new Error('Failed to update package');
    }
  }

  async delete(id: SelectPackage['id']) {
    try {
      const query = this._db
        .deleteFrom('packages')
        .where('packages.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete package', result);
        return new Error('Failed to delete package');
      }

      return;
    } catch (error) {
      console.error('Error deleting package:', error);
      return new Error('Failed to delete package');
    }
  }
}
