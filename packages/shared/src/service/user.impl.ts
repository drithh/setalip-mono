import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { UserService } from './user';
import type {
  UserRepository,
  InsertUser,
  SelectUser,
  UpdateUser,
  FindAllUserOptions,
} from '../repository';

@injectable()
export class UserServiceImpl implements UserService {
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.UserRepository)
    userRepository: UserRepository
  ) {
    this._userRepository = userRepository;
  }

  async findAll(data: FindAllUserOptions) {
    const users = await this._userRepository.findAll(data);

    return {
      result: users,
      error: undefined,
    };
  }

  async findById(id: SelectUser['id']) {
    const user = await this._userRepository.findById(id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    return {
      result: user,
    };
  }

  async update(data: UpdateUser) {
    const result = await this._userRepository.update(data);

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
