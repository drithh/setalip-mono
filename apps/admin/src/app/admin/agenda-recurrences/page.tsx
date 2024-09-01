import { FindAllAgendaRecurrenceOption } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import AgendaRecurrenceTable from './crud/table';
import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { findAllAgendaRecurrenceSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';

export interface IndexPageProps {
  searchParams: FindAllAgendaRecurrenceOption;
}

export default async function AgendaRecurrences({
  searchParams,
}: IndexPageProps) {
  const search = findAllAgendaRecurrenceSchema.parse(searchParams);

  const classService = container.get<ClassService>(TYPES.ClassService);
  const classes = await classService.findAll({});

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

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
          <AgendaRecurrenceTable
            classes={classes?.result?.data ?? []}
            locations={locations?.result ?? []}
            coaches={coaches?.result ?? []}
            search={search}
          />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
