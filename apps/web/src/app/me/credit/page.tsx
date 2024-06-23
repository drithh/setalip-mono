import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  CreditService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import CreditTransactionTable from './credit-transaction';
import { findAllUserCreditSchema } from '@repo/shared/api/schema';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

export default async function Credit({ searchParams }: { searchParams: any }) {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  const search = findAllUserCreditSchema.parse(searchParams);

  const creditService = container.get<CreditService>(TYPES.CreditService);
  const credits = await creditService.findAmountByUserId(auth.id);

  return (
    <div className="w-full border-2 border-primary p-6">
      <h1 className="text-3xl font-bold">Credit</h1>
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {credits?.result?.map((credit) => (
          <Card key={credit?.class_type_id} className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="capitalize">
                {credit?.class_type_name} Class
              </CardTitle>
              <CardDescription className="text-lg font-semibold">
                {credit?.remaining_amount} Credit
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <CreditTransactionTable search={search} />
      </div>
    </div>
  );
}
