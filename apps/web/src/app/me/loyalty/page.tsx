import { TYPES, container } from '@repo/shared/inversify';
import { LoyaltyService } from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import LoyaltyTransactionTable from './loyalty-transaction';
import {
  findAllScheduleSchema,
  findAllUserAgendaSchema,
  findAllUserLoyaltySchema,
} from '@repo/shared/api/schema';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

export default async function Loyalty({ searchParams }: { searchParams: any }) {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  const searchWithUser = {
    ...searchParams,
    user_id: auth.id,
  };
  const search = findAllUserLoyaltySchema.parse(searchWithUser);

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);
  const loyaltys = await loyaltyService.findAmountByUserId(auth.id);

  return (
    <div className="w-full border-2 border-primary p-6">
      <h1 className="text-3xl font-bold">Loyalty</h1>
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="sm:col-span-1">
          <CardHeader>
            <CardTitle className="capitalize">Balance</CardTitle>
            <CardDescription className="text-lg font-semibold">
              {(loyaltys.result?.total_debit ?? 0) -
                (loyaltys.result?.total_credit ?? 0)}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <LoyaltyTransactionTable search={search} />
      </div>
    </div>
  );
}
