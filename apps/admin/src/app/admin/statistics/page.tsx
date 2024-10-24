import { FindAllStatisticOption } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import StatisticTable from './crud-statistics/table';
import { TYPES, container } from '@repo/shared/inversify';
import { ClassTypeService } from '@repo/shared/service';
import { findAllStatisticSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';

export interface IndexPageProps {
  searchParams: Promise<FindAllStatisticOption>;
}

export default async function Statistics(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = findAllStatisticSchema.parse(searchParams);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
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
          <StatisticTable
            classTypes={classTypes.result ?? []}
            search={search}
          />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
