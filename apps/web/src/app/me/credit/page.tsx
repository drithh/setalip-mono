import { TYPES, container } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import AgendaTable from './agenda';
import {
  findAllScheduleSchema,
  findAllUserAgendaSchema,
} from '@repo/shared/api/schema';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';

export default async function Schedules({
  searchParams,
}: {
  searchParams: any;
}) {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  const searchWithUser = {
    ...searchParams,
    userId: auth.id,
  };
  const search = findAllUserAgendaSchema.parse(searchWithUser);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

  return (
    <div className="w-full border-2 border-primary p-6">
      <h1 className="text-3xl font-bold">Credit</h1>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
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
