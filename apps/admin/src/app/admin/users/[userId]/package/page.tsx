import { findAllPackageTransactionByUserIdSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import { PackageService } from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { format } from 'date-fns';

import { validateAdmin, validateUser } from '@/lib/auth';

import PackageTransactionTable from './_components/package-transaction';
import { getUser } from '../_lib/get-user';
import { userSchema } from '../form-schema';

export default async function Package({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) {
  const auth = await validateAdmin();

  const parsedParams = userSchema.parse(params);

  const search = findAllPackageTransactionByUserIdSchema.parse(searchParams);

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Package</h1>
      <div className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <PackageTransactionTable search={search} params={parsedParams} />
      </div>
    </div>
  );
}
