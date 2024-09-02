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

import { validateUser } from '@/lib/auth';

import PackageTransactionTable from './_components/package-transaction';

export default async function Package({ searchParams }: { searchParams: any }) {
  const auth = await validateUser();

  const search = findAllPackageTransactionByUserIdSchema.parse(searchParams);

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Package</h1>
      <div className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <PackageTransactionTable search={search} />
      </div>
    </div>
  );
}
