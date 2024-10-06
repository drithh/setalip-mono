import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { ReportFormService } from './index';
import type {
  ReportFormRepository,
  InsertReportForm,
  SelectReportForm,
} from '../repository';

@injectable()
export class ReportFormServiceImpl implements ReportFormService {
  private _reportFormRepository: ReportFormRepository;

  constructor(
    @inject(TYPES.ReportFormRepository)
    reportFormRepository: ReportFormRepository
  ) {
    this._reportFormRepository = reportFormRepository;
  }

  async findAll() {
    const reportForms = await this._reportFormRepository.findAll();

    return {
      result: reportForms,
      error: undefined,
    };
  }

  async createAll(data: InsertReportForm[]) {
    const result = await this._reportFormRepository.createAll(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async deleteAll() {
    const result = await this._reportFormRepository.deleteAll();

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result,
    };
  }
}
