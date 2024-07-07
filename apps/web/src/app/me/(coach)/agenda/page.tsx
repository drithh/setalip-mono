import { TYPES, container } from '@repo/shared/inversify';
import {
  AgendaService,
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import AgendaTable from './agenda';
import {
  findAllCoachAgendaSchema,
  findAllScheduleSchema,
  findAllUserAgendaSchema,
} from '@repo/shared/api/schema';
import { redirect } from 'next/navigation';
import { validateUser } from '@/lib/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@repo/ui/components/ui/card';
import { addMinutes, format } from 'date-fns';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';

export default async function Schedules({
  searchParams,
}: {
  searchParams: any;
}) {
  const auth = await validateUser();
  if (auth.user.role !== 'coach') {
    redirect('/me');
  }

  const search = findAllCoachAgendaSchema.parse(searchParams);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  const agendas = await agendaService.findTodayScheduleByCoachId(auth.user.id);

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold">Today's Schedule</h1>
      <div className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {agendas?.result?.map((agenda) => (
          <Card key={agenda.id} className="sm:col-span-1">
            <CardHeader>
              <CardTitle className="flex flex-col gap-2 capitalize">
                {agenda.class_name}
                <Badge className="w-fit">{agenda.class_type_name} class</Badge>
              </CardTitle>
              <CardDescription className="capitalize">
                {agenda.location_name} - {agenda.location_facility_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <p>
                Waktu: {format(new Date(agenda.time), 'HH:mm')} -{' '}
                {format(
                  addMinutes(new Date(agenda.time), agenda.class_duration),
                  'HH:mm',
                )}
              </p>
              <p>Participant: {agenda.participant}</p>
              <Link href={`/me/agenda/${agenda.id}`}>
                <Button variant="default" className="mt-4 w-full">
                  Attendances
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <h1 className="text-3xl font-bold">All Schedule</h1>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <AgendaTable
          locations={locations.result || []}
          classTypes={classTypes.result || []}
          search={search}
        />
      </div>
    </div>
  );
}
