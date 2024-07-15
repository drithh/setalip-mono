import { FindAllPackageOptions } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import { findAllUserSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '../../../lib/query-reset-boundary';
import React from 'react';
import UserTable from './_components/user-table';
import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  LocationService,
} from '@repo/shared/service';
import { validateAdmin } from '@/lib/auth';

export interface IndexPageProps {
  searchParams: FindAllPackageOptions;
}

export default async function Packages({ searchParams }: IndexPageProps) {
  const auth = validateAdmin();

  const search = findAllUserSchema.parse(searchParams);

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <QueryResetBoundary>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
              shrinkZero
            />
          }
        >
          <UserTable
            search={search}
            locations={locations.result ?? []}
            classTypes={classTypes.result ?? []}
          />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
