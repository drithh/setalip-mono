import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertCredit,
  CreditRepository,
  SelectCredit,
  UpdateCredit,
  DeleteCredit,
  ClassTypeRepository,
  UserRepository,
  FindAllCreditOptions,
} from '../repository';
import { CreditService } from './credit';

@injectable()
export class CreditServiceImpl implements CreditService {
  private _creditRepository: CreditRepository;
  private _classTypeRepository: ClassTypeRepository;
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository,
    @inject(TYPES.ClassTypeRepository) classTypeRepository: ClassTypeRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this._creditRepository = creditRepository;
    this._classTypeRepository = classTypeRepository;
    this._userRepository = userRepository;
  }

  async findAll() {
    const credites = await this._creditRepository.findAll();

    return {
      result: credites,
      error: undefined,
    };
  }

  async findById(id: SelectCredit['id']) {
    const credit = await this._creditRepository.findById(id);

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async findAmountByUserId(userId: SelectCredit['user_id']) {
    const credit = await this._creditRepository.findAmountByUserId(userId);

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async findAllByUserId(data: FindAllCreditOptions) {
    const credit = await this._creditRepository.findAllByUserId(data);

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async create(data: InsertCredit) {
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

    const result = await this._creditRepository.create(insertedData);

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

  async update(data: UpdateCredit) {
    const result = await this._creditRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async delete(data: InsertCredit) {
    const result = await this._creditRepository.delete(data);

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
