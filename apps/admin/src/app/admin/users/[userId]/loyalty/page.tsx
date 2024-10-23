import { findAllUserLoyaltySchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import { LoyaltyService } from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { validateAdmin, validateUser } from '@/lib/auth';

import LoyaltyTransactionTable from './loyalty-transaction';
import ReferNow from './refer-now';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { getUser } from '../_lib/get-user';
import { userSchema } from '../form-schema';

export default async function Loyalty(
  props: {
    searchParams: Promise<any>;
    params: Promise<any>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const auth = await validateAdmin();

  const parsedParams = userSchema.parse(params);

  const user = await getUser(parsedParams);

  const search = findAllUserLoyaltySchema.parse(searchParams);

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);
  const loyaltys = await loyaltyService.findAmountByUserId(user.id);

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty</h1>
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="capitalize">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {(loyaltys.result?.total_debit ?? 0) -
                (loyaltys.result?.total_credit ?? 0)}{' '}
              points
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Transaction</h1>
        <div className="mx-auto my-4 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
          <LoyaltyTransactionTable search={search} params={parsedParams} />
        </div>
      </div>
    </div>
  );
}
