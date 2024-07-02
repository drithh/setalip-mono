import { PromiseResult } from '../types';

export interface DashboardService {
  countUser(): PromiseResult<number, Error>;
}
