import { TYPES, container } from '@repo/shared/inversify';
import { LoyaltyService } from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import LoyaltyTransactionTable from './loyalty-transaction';
import {
  findAllScheduleSchema,
  findAllUserAgendaSchema,
  findAllUserLoyaltySchema,
} from '@repo/shared/api/schema';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { validateUser } from '@/lib/auth';

export default async function Loyalty({ searchParams }: { searchParams: any }) {
  const auth = await validateUser();

  const search = findAllUserLoyaltySchema.parse(searchParams);

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);
  const loyaltys = await loyaltyService.findAmountByUserId(auth.user.id);

  return (
    <div className="w-full border-2 border-primary p-6">
      <h1 className="text-3xl font-bold">Loyalty</h1>
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <LoyaltyTransactionTable search={search} />
      </div>
    </div>
  );
}
