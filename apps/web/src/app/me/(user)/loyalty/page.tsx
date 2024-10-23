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

import { validateUser } from '@/lib/auth';

import LoyaltyTransactionTable from './loyalty-transaction';
import ReferNow from './refer-now';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';

export default async function Loyalty(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const auth = await validateUser();

  const search = findAllUserLoyaltySchema.parse(searchParams);

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);
  const loyaltys = await loyaltyService.findAmountByUserId(auth.user.id);

  const loyaltyRewards = await loyaltyService.findAllReward({
    perPage: 100,
    is_active: 1,
  });

  const loyaltyShops = await loyaltyService.findAllShop({
    perPage: 100,
  });

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
        <h3 className="text-2xl font-semibold">How to earn points?</h3>
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 ">
          {loyaltyRewards.result?.data.map((reward) => (
            <Card key={reward.id}>
              <CardHeader>
                <CardTitle className="flex place-content-between items-center capitalize">
                  {reward.name}
                  {reward.name === 'Referrals' && (
                    <ReferNow user_id={auth.user.id} />
                  )}
                </CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold">What can you redeem?</h3>
        <h5 className="text-lg">
          Berikut adalah item yang dapat kamu tukarkan dengan poinmu. Silahkan
          tanyakan kepada staff kami jika ingin melakukan penukaran.
        </h5>
        <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loyaltyShops.result?.data.map((shop) => (
            <Card key={shop.id}>
              <CardHeader className="p-2">
                <AspectRatio ratio={16 / 9}>
                  <ImageWithFallback
                    src={shop.image_url || 'placeholder.svg'}
                    alt={shop.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
                <CardTitle className="flex place-content-between items-center text-lg capitalize">
                  {shop.name}
                </CardTitle>
                <CardDescription>{shop.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-sm">Price: {shop.price} points</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">Transaction</h1>
        <div className="mx-auto my-4 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
          <LoyaltyTransactionTable search={search} />
        </div>
      </div>
    </div>
  );
}
