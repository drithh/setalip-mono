import { findAllScheduleSchema } from '@repo/shared/api/schema';
import { container,TYPES } from '@repo/shared/inversify';
import {
  ClassService,
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';

import { validateRequest } from '@/lib/auth';

import AgendaTable from './agenda';

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
      <div className="mx-auto flex min-h-screen w-full max-w-[90vw] flex-col gap-24 py-4 sm:py-32 md:max-w-screen-xl">
        <AgendaTable
          locations={locations.result || []}
          coaches={coaches.result || []}
          classTypes={classTypes.result || []}
          classes={classes.result?.data || []}
          search={{
            ...search,
          }}
        />
      </div>
    </div>
  );
}
