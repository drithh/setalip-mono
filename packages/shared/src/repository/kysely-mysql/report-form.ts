import { Database } from '#dep/db/index';
import { TYPES } from '#dep/inversify/types';
import { injectable, inject } from 'inversify';
import { LocationRepository } from '../location';
import { ReportFormRepository, InsertReportForm, SelectReportForm } from '..';

@injectable()
export class KyselyMySqlReportFormRepository implements ReportFormRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async count() {
    const query = await this._db
      .selectFrom('report_forms')
      .select(({ fn }) => [fn.count<number>('report_forms.input').as('count')])
      .executeTakeFirst();

    return query?.count ?? 0;
  }

  async findAll() {
    return this._db.selectFrom('report_forms').selectAll().execute();
  }

  async createAll(data: InsertReportForm[]) {
    try {
      const query = this._db
        .insertInto('report_forms')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create class type', result);
        return new Error('Failed to create class type');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating class type:', error);
      return new Error('Failed to create class type');
    }
  }

  async deleteAll() {
    try {
      const query = this._db.deleteFrom('report_forms').execute();

      if (query === undefined) {
        console.error('Failed to delete class type');
        return new Error('Failed to delete class type');
      }

      return;
    } catch (error) {
      console.error('Error deleting class type:', error);
      return new Error('Failed to delete class type');
    }
  }
}
