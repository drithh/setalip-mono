import { TYPES, container } from '@repo/shared/inversify';
import {
  AgendaService,
  ClassTypeService,
  CoachService,
  LocationService,
} from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
import AgendaTable from './attendance';
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

export default async function Attendances({
  params,
}: {
  params: { agendaId: string };
}) {
  const auth = await validateUser();
  if (auth.user.role !== 'coach') {
    redirect('/me');
  }

  const packageIdNumber = parseInt(params.agendaId);
  if (isNaN(packageIdNumber)) {
    redirect('/me/agenda');
  }

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  const agendas =
    await agendaService.findAllParticipantByAgendaId(packageIdNumber);

  if (agendas.error) {
    redirect('/me/agenda');
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold">Attendances</h1>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[90vw] flex-col gap-24 md:max-w-screen-xl">
        <AgendaTable participants={agendas.result} />
      </div>
    </div>
  );
}
