import { SelectLoyaltyShop } from '@repo/shared/repository';

export const LOYALTY_SHOP_TYPES = [
  'item',
  'package',
] satisfies SelectLoyaltyShop['type'][];
