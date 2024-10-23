import { findAllUserCreditSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CreditService,
  PackageService,
} from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { validateAdmin, validateUser } from '@/lib/auth';

import CreditTransactionTable from './credit-transaction';
import { format } from 'date-fns';
import { getUser } from '../_lib/get-user';
import { userSchema } from '../form-schema';

export default async function Credit(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const auth = await validateAdmin();

  const parsedParams = userSchema.parse(params);

  const user = await getUser(parsedParams);
  const search = findAllUserCreditSchema.parse(searchParams);

  const packageService = container.get<PackageService>(TYPES.PackageService);
  const packages = await packageService.findAllUserPackageActiveByUserId(
    user.id,
  );

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Credit</h1>
      <div className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {packages?.result?.map((singlePackage) => (
          <Card key={singlePackage?.id} className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="capitalize">
                {singlePackage?.package_name ?? singlePackage.note}
              </CardTitle>
              <CardDescription className="capitalize">
                {singlePackage?.class_type}
                <p className="text-xs opacity-70">{singlePackage?.note}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <p>
                Sessions Remaining:{' '}
                {singlePackage?.credit - (singlePackage?.credit_used ?? 0)}
              </p>
              <p>
                Expired At:{' '}
                {format(
                  new Date(singlePackage?.expired_at ?? new Date()),
                  'dd MMM yyyy',
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <CreditTransactionTable
          search={search}
          params={parsedParams}
          classTypes={classTypes.result ?? []}
        />
      </div>
    </div>
  );
}
