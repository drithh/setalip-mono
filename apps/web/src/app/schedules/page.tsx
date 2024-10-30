import { findAllScheduleSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import {
  ClassService,
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';

import { validateRequest } from '@/lib/auth';

import AgendaTable from './agenda';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';

export default async function Schedules({
  searchParams,
}: {
  searchParams: any;
}) {
  const auth = await validateRequest();

  const search = findAllScheduleSchema.parse(searchParams);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  const classService = container.get<ClassService>(TYPES.ClassService);
  const classes = await classService.findAll({
    perPage: 100,
  });

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

  return (
    <div className="">
      <div className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-24 py-4 sm:py-32 md:max-w-screen-xl">
        <QueryResetBoundary>
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={7}
                filterableColumnCount={4}
                cellWidths={[
                  '114px',
                  '334px',
                  '216px',
                  '122px',
                  '174px',
                  '119px',
                  '167px',
                ]}
                shrinkZero
              />
            }
          >
            <AgendaTable
              locations={locations.result || []}
              coaches={coaches.result || []}
              classTypes={classTypes.result || []}
              classes={classes.result?.data || []}
              search={search}
            />
          </React.Suspense>
        </QueryResetBoundary>
      </div>
    </div>
  );
}
