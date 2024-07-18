import { findAllPackageSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import { ClassTypeService, PackageService } from '@repo/shared/service';

import ListPackage from './list-package';

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
    is_active: 1,
  });

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col  px-8 py-4 sm:py-20 md:max-w-screen-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Packages</h1>
        </div>
      </div>

      <ListPackage
        packages={packages.result?.data ?? []}
        classTypes={classTypes.result ?? []}
      />
    </div>
  );
}
