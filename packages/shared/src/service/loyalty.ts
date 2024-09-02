import {
  SelectLoyalty,
  InsertLoyalty,
  UpdateLoyalty,
  DeleteLoyalty,
  SelectAmountLoyalty,
  FindAllLoyaltyByUserIdOptions,
  SelectAllLoyaltyByUserId,
  FindAllLoyaltyOptions,
  SelectAllLoyalty,
  FindAllLoyaltyRewardOptions,
  FindAllLoyaltyShopOptions,
  SelectAllLoyaltyReward,
  SelectAllLoyaltyShop,
  SelectLoyaltyReward,
  SelectLoyaltyShop,
  InsertLoyaltyReward,
  InsertLoyaltyShop,
  UpdateLoyaltyReward,
  UpdateLoyaltyShop,
  InsertLoyaltyOnReward,
  InsertLoyaltyFromShop,
} from '../repository';
import { PromiseResult } from '../types';

export interface LoyaltyService {
  findAll(data: FindAllLoyaltyOptions): PromiseResult<SelectAllLoyalty, Error>;
  findAllReward(
    data: FindAllLoyaltyRewardOptions
  ): PromiseResult<SelectAllLoyaltyReward, Error>;
  findAllShop(
    data: FindAllLoyaltyShopOptions
  ): PromiseResult<SelectAllLoyaltyShop, Error>;

  findById(
    id: SelectLoyalty['id']
  ): PromiseResult<SelectLoyalty | undefined, Error>;
  findRewardByName(
    name: SelectLoyaltyReward['name']
  ): PromiseResult<SelectLoyaltyReward | undefined, Error>;
  findShopByName(
    name: SelectLoyaltyShop['name']
  ): PromiseResult<SelectLoyaltyShop | undefined, Error>;
  findAmountByUserId(
    userId: SelectLoyalty['user_id']
  ): PromiseResult<SelectAmountLoyalty | undefined, Error>;
  findAllByUserId(
    data: FindAllLoyaltyByUserIdOptions
  ): PromiseResult<SelectAllLoyaltyByUserId, Error>;

  create(data: InsertLoyalty): PromiseResult<SelectLoyalty, Error>;
  createFromShop(
    data: InsertLoyaltyFromShop
  ): PromiseResult<SelectLoyalty, Error>;
  createOnReward(data: InsertLoyaltyOnReward): PromiseResult<undefined, Error>;
  createReward(
    data: InsertLoyaltyReward
  ): PromiseResult<SelectLoyaltyReward, Error>;
  createShop(data: InsertLoyaltyShop): PromiseResult<SelectLoyaltyShop, Error>;

  update(data: UpdateLoyalty): PromiseResult<undefined, Error>;
  updateReward(data: UpdateLoyaltyReward): PromiseResult<undefined, Error>;
  updateShop(data: UpdateLoyaltyShop): PromiseResult<undefined, Error>;

  delete(id: DeleteLoyalty): PromiseResult<undefined, Error>;
  deleteReward(id: SelectLoyaltyReward['id']): PromiseResult<undefined, Error>;
  deleteShop(id: SelectLoyaltyShop['id']): PromiseResult<undefined, Error>;
}
