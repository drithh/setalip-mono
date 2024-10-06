import { SelectReportForm, InsertReportForm } from '../repository';
import { PromiseResult } from '../types';

export interface ReportFormService {
  findAll(): PromiseResult<SelectReportForm[], Error>;

  createAll(data: InsertReportForm[]): PromiseResult<SelectReportForm, Error>;
  deleteAll(): PromiseResult<undefined, Error>;
}
