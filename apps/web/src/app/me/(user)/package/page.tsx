import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  PackageService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import PackageTransactionTable from './package-transaction';
import { findAllPackageTransactionByUserIdSchema } from '@repo/shared/api/schema';
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
import { dateFormatter } from '@repo/shared/util';
import { format } from 'date-fns';

export default async function Package({ searchParams }: { searchParams: any }) {
  const auth = await validateUser();

  const search = findAllPackageTransactionByUserIdSchema.parse(searchParams);

  const packageService = container.get<PackageService>(TYPES.PackageService);
  const packages = await packageService.findAllActivePackageByUserId(
    auth.user.id,
  );

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold">Package</h1>
      <div className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {packages?.result?.map((singlePackage) => (
          <Card key={singlePackage?.id} className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="capitalize">
                {singlePackage?.package_name}
              </CardTitle>
              <CardDescription className="capitalize">
                {singlePackage?.class_type}
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <p>
                Sessions Remaining:{' '}
                {singlePackage?.credit - (singlePackage?.credit_used ?? 0)}
              </p>
              <p>
                Expired At:{' '}
                {format(new Date(singlePackage?.expired_at), 'dd MMM yyyy')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <PackageTransactionTable search={search} />
      </div>
    </div>
  );
}
