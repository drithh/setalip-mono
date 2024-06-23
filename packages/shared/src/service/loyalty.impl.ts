import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertLoyalty,
  LoyaltyRepository,
  SelectLoyalty,
  UpdateLoyalty,
  DeleteLoyalty,
  UserRepository,
  FindAllLoyaltyOptions,
} from '../repository';
import { LoyaltyService } from './loyalty';

@injectable()
export class LoyaltyServiceImpl implements LoyaltyService {
  private _loyaltyRepository: LoyaltyRepository;
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.LoyaltyRepository) loyaltyRepository: LoyaltyRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this._loyaltyRepository = loyaltyRepository;
    this._userRepository = userRepository;
  }

  async findAll() {
    const loyaltyes = await this._loyaltyRepository.findAll();

    return {
      result: loyaltyes,
      error: undefined,
    };
  }

  async findById(id: SelectLoyalty['id']) {
    const loyalty = await this._loyaltyRepository.findById(id);

    if (!loyalty) {
      return {
        error: new Error('Loyalty not found'),
      };
    }

    return {
      result: loyalty,
    };
  }

  async findAmountByUserId(userId: SelectLoyalty['user_id']) {
    const loyalty = await this._loyaltyRepository.findAmountByUserId(userId);

    if (!loyalty) {
      return {
        error: new Error('Loyalty not found'),
      };
    }

    return {
      result: loyalty,
    };
  }

  async findAllByUserId(data: FindAllLoyaltyOptions) {
    const loyalty = await this._loyaltyRepository.findAllByUserId(data);

    if (!loyalty) {
      return {
        error: new Error('Loyalty not found'),
      };
    }

    return {
      result: loyalty,
    };
  }

  async create(data: InsertLoyalty) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        result: undefined,
        error: new Error('User not found'),
      };
    }

    const insertedData = {
      ...data,
    } satisfies InsertLoyalty;

    const result = await this._loyaltyRepository.create(insertedData);

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

  async update(data: UpdateLoyalty) {
    const result = await this._loyaltyRepository.update(data);

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

  async delete(data: DeleteLoyalty) {
    const result = await this._loyaltyRepository.delete(data);

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
