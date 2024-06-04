import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FindAllPackageOptions, SelectPackage } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import Link from 'next/link';
import { api } from '@/trpc/react';
import PackageTable from './package-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useDataTable } from '@/hooks/use-data-table';
import { getColumns } from './columns';
import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassService,
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { findAllPackageSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '../../lib/query-reset-boundary';
import React from 'react';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';

export interface IndexPageProps {
  searchParams: FindAllPackageOptions;
}

export default async function Packages({ searchParams }: IndexPageProps) {
  // const session = await getAuth();
  // if (!session) {
  //   redirect('/login');
  // }

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
