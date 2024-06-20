import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  LocationService,
  PackageService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import { findAllPackageSchema } from '@repo/shared/api/schema';
import { moneyFormatter } from '@repo/shared/util';
import { Separator } from '@repo/ui/components/ui/separator';
import { Button } from '@repo/ui/components/ui/button';
import Package from './package';

export default async function Schedules({
  searchParams,
}: {
  searchParams: any;
}) {
  const search = findAllPackageSchema.parse(searchParams);

  const packageService = container.get<PackageService>(TYPES.PackageService);
  const packages = await packageService.findAll({
    ...search,
    perPage: 100,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[90vw] flex-col gap-24 px-8 py-4 sm:py-20 md:max-w-screen-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Packages</h1>
          <p className="text-sm text-gray-500">
            {packages.result?.data.length} packages found
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {packages.result?.data.map((singlePackage) => (
            <Package key={singlePackage.id} singlePackage={singlePackage} />
          ))}
        </div>
      </div>
    </div>
  );
}
