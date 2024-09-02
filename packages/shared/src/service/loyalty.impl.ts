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
  FindAllLoyaltyByUserIdOptions,
  FindAllLoyaltyOptions,
  FindAllLoyaltyShopOptions,
  SelectAllLoyaltyShop,
  FindAllLoyaltyRewardOptions,
  InsertLoyaltyReward,
  InsertLoyaltyShop,
  SelectLoyaltyReward,
  SelectLoyaltyShop,
  UpdateLoyaltyReward,
  UpdateLoyaltyShop,
  InsertLoyaltyOnReward,
  InsertLoyaltyFromShop,
} from '../repository';
import { LoyaltyService } from './loyalty';
import { PromiseResult } from '../types';

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

  async findAll(data: FindAllLoyaltyOptions) {
    const loyaltyes = await this._loyaltyRepository.findAll(data);

    return {
      result: loyaltyes,
      error: undefined,
    };
  }

  async findAllReward(data: FindAllLoyaltyRewardOptions) {
    const loyaltyes = await this._loyaltyRepository.findAllReward(data);

    return {
      result: loyaltyes,
      error: undefined,
    };
  }

  async findAllShop(data: FindAllLoyaltyShopOptions) {
    const loyaltyes = await this._loyaltyRepository.findAllShop(data);

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

  async findRewardByName(name: SelectLoyaltyReward['name']) {
    const loyalty = await this._loyaltyRepository.findRewardByName(name);

    if (!loyalty) {
      return {
        error: new Error('Loyalty not found'),
      };
    }

    return {
      result: loyalty,
    };
  }

  async findShopByName(name: SelectLoyaltyShop['name']) {
    const loyalty = await this._loyaltyRepository.findShopByName(name);

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

  async findAllByUserId(data: FindAllLoyaltyByUserIdOptions) {
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

  async createFromShop(data: InsertLoyaltyFromShop) {
    const result = await this._loyaltyRepository.createFromShop(data);

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

  async createOnReward(data: InsertLoyaltyOnReward) {
    const result = await this._loyaltyRepository.createOnReward(data);

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

  async createReward(data: InsertLoyaltyReward) {
    const result = await this._loyaltyRepository.createReward(data);

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

  async createShop(data: InsertLoyaltyShop) {
    const result = await this._loyaltyRepository.createShop(data);

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

  async updateReward(data: UpdateLoyaltyReward) {
    const result = await this._loyaltyRepository.updateReward(data);

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

  async updateShop(data: UpdateLoyaltyShop) {
    const result = await this._loyaltyRepository.updateShop(data);

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

  async deleteReward(id: SelectLoyaltyReward['id']) {
    const result = await this._loyaltyRepository.deleteReward(id);

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

  async deleteShop(id: SelectLoyaltyShop['id']) {
    const result = await this._loyaltyRepository.deleteShop(id);

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
