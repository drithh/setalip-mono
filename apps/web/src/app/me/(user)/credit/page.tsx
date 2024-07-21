import { findAllUserCreditSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import { CreditService } from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { validateUser } from '@/lib/auth';

import CreditTransactionTable from './credit-transaction';

export default async function Credit({ searchParams }: { searchParams: any }) {
  const auth = await validateUser();

  const search = findAllUserCreditSchema.parse(searchParams);

  const creditService = container.get<CreditService>(TYPES.CreditService);
  const credits = await creditService.findAmountByUserId(auth.user.id);

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Credit</h1>
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {credits?.result?.map((credit) => (
          <Card key={credit?.class_type_id} className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="capitalize">
                {credit?.class_type_name} Class
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <p>{credit?.remaining_amount} credit remaining</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <CreditTransactionTable search={search} />
      </div>
    </div>
  );
}
