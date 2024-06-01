import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { UserService } from './user';
import type {
  UserRepository,
  InsertUser,
  SelectUser,
  UpdateUser,
  FindAllUserOptions,
  InsertCredit,
  ClassTypeRepository,
} from '../repository';
import { PromiseResult } from '../types';

@injectable()
export class UserServiceImpl implements UserService {
  private _userRepository: UserRepository;
  private _classTypeRepository: ClassTypeRepository;

  constructor(
    @inject(TYPES.UserRepository)
    userRepository: UserRepository,
    @inject(TYPES.ClassTypeRepository)
    classTypeRepository: ClassTypeRepository
  ) {
    this._userRepository = userRepository;
    this._classTypeRepository = classTypeRepository;
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

  async createCredit(data: InsertCredit) {
    const classType = await this._classTypeRepository.findById(
      data.class_type_id
    );

    if (!classType) {
      return {
        result: undefined,
        error: new Error('Class type not found'),
      };
    }

    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        result: undefined,
        error: new Error('User not found'),
      };
    }

    const insertedData = {
      ...data,
    } satisfies InsertCredit;

    const result = await this._userRepository.createCredit(insertedData);

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
