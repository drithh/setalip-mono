import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import AgendaTable from './agenda';
import { findAllScheduleSchema } from '@repo/shared/api/schema';

export default async function Schedules({
  searchParams,
}: {
  searchParams: any;
}) {
  const search = findAllScheduleSchema.parse(searchParams);
  console.log('search', search);
  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

  return (
    <div className="bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[90vw] flex-col gap-24  py-32 md:max-w-screen-xl">
        <AgendaTable
          locations={locations.result || []}
          coaches={coaches.result || []}
          classTypes={classTypes.result || []}
          search={search}
        />
      </div>
    </div>
  );
}
