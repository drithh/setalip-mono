import { findAllUserAgendaSchema } from '@repo/shared/api/schema';
import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';

import { validateAdmin, validateUser } from '@/lib/auth';

import AgendaTable from './agenda';
import { getUser } from '../_lib/get-user';

export default async function Schedules(
  props: {
    params: Promise<any>;
    searchParams: Promise<any>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const auth = await validateAdmin();
  const user = await getUser(params);
  const search = findAllUserAgendaSchema.parse(searchParams);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const coachService = container.get<CoachService>(TYPES.CoachService);
  const coaches = await coachService.findAll();

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Booking</h1>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <AgendaTable
          locations={locations.result || []}
          coaches={coaches.result || []}
          classTypes={classTypes.result || []}
          search={search}
          params={params}
        />
      </div>
    </div>
  );
}
