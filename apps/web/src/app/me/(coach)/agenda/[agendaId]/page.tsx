import { container, TYPES } from '@repo/shared/inversify';
import { AgendaService } from '@repo/shared/service';

import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import AgendaTable from './attendance';
import { BackButton } from '@repo/ui/components/back-button';

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
    <div className="w-full p-2 md:p-6">
      <div className="flex place-items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">Attendances</h1>
      </div>
      <div className="mx-auto mt-8 flex min-h-screen w-full max-w-[95vw] flex-col gap-24 md:max-w-screen-xl">
        <AgendaTable participants={agendas.result} />
      </div>
    </div>
  );
}
