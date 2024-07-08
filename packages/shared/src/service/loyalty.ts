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
} from '../repository';
import { PromiseResult } from '../types';

export interface LoyaltyService {
  findAll(data: FindAllLoyaltyOptions): PromiseResult<SelectAllLoyalty, Error>;
  findById(
    id: SelectLoyalty['id']
  ): PromiseResult<SelectLoyalty | undefined, Error>;
  findAmountByUserId(
    userId: SelectLoyalty['user_id']
  ): PromiseResult<SelectAmountLoyalty | undefined, Error>;
  findAllByUserId(
    data: FindAllLoyaltyByUserIdOptions
  ): PromiseResult<SelectAllLoyaltyByUserId, Error>;

  create(data: InsertLoyalty): PromiseResult<SelectLoyalty, Error>;

  update(data: UpdateLoyalty): PromiseResult<undefined, Error>;

  delete(id: DeleteLoyalty): PromiseResult<undefined, Error>;
}
