import { findAllPackageSchema } from '@repo/shared/api/schema';
import { TYPES, container } from '@repo/shared/inversify';
import { FindAllPackageOptions } from '@repo/shared/repository';
import {
  ClassService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import React from 'react';
import QueryResetBoundary from '../../../lib/query-reset-boundary';
import PackageTable from './_components/package-table';

export interface IndexPageProps {
  searchParams: FindAllPackageOptions;
}

export default async function Packages({ searchParams }: IndexPageProps) {
  const search = findAllPackageSchema.parse(searchParams);
  console.log('search', search);
  const classService = container.get<ClassService>(TYPES.ClassService);
  const classes = await classService.findAll({});

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

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
          <PackageTable
            locations={locations?.result ?? []}
            coaches={coaches?.result ?? []}
            classes={classes?.result?.data ?? []}
            search={search}
          />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
