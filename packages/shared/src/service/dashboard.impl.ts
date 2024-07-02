import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type { UserRepository } from '../repository';
import { DashboardService } from './index';

@injectable()
export class DashboardServiceImpl implements DashboardService {
  private _userepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this._userepository = userRepository;
  }

  async countUser() {
    const count = await this._userepository.count();
    return {
      error: undefined,
      result: count,
    };
  }
}
