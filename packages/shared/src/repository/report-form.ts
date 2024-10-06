import { Insertable, Selectable, Updateable } from 'kysely';
import { ReportForms } from '../db';
import { OptionalToRequired } from '.';

export type SelectReportForm = Selectable<ReportForms>;

export type InsertReportForm = Insertable<ReportForms>;

export interface ReportFormRepository {
  count(): Promise<number>;

  findAll(): Promise<SelectReportForm[]>;
  createAll(data: InsertReportForm[]): Promise<SelectReportForm | Error>;
  deleteAll(): Promise<undefined | Error>;
}
