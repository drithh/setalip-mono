import { container, TYPES } from '@repo/shared/inversify';
import {
  AgendaService,
  StatisticService,
  UserService,
} from '@repo/shared/service';
import { Card } from '@repo/ui/components/ui/card';

import { validateAdmin, validateUser } from '@/lib/auth';
import { StatisticBadge } from './_components/statistic-badge';
import { userSchema } from '../form-schema';
import { redirect } from 'next/navigation';
import { getUser } from '../_lib/get-user';

export default async function Statistic({ params }: any) {
  const auth = await validateAdmin();

  const user = await getUser(params);

  const statisticService = container.get<StatisticService>(
    TYPES.StatisticService,
  );
  const statistics = await statisticService.findAll({
    perPage: 100,
    sort: 'point.asc',
    role: [
      user.role === 'admin'
        ? 'user'
        : user.role === 'owner'
          ? 'user'
          : user.role,
    ],
  });

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  let totalAgenda = 0;

  if (user.role === 'coach') {
    totalAgenda = (await agendaService.countCoachAgenda(auth.user.id)) ?? 0;
  } else {
    totalAgenda =
      (await agendaService.countCheckedInByUserId(auth.user.id)) ?? 0;
  }

  // compare if the currentStatistic is less than the totalAgenda then get the statistics
  const currentStatistic = statistics.result?.data
    .filter((stat) => stat.point < totalAgenda)
    .pop();

  return (
    <div className="w-full p-2 md:p-6">
      <h1 className="text-3xl font-bold">Statistic</h1>
      <Card className="mx-auto my-4 flex w-96 max-w-full flex-col place-items-center justify-between p-4">
        <p className="text-center text-3xl font-semibold capitalize">
          {currentStatistic?.name ?? 'No milestone yet'}
        </p>
        <p className="text-[5rem] font-semibold">{totalAgenda}</p>
        <p className="text-3xl font-semibold">Lifetime</p>
      </Card>
      <h1 className="text-3xl font-bold">Milestones</h1>
      {
        <div className="mt-4 flex flex-wrap items-start justify-between">
          {statistics.result?.data.map((stat) => (
            <StatisticBadge
              key={stat.id}
              statistic={stat}
              totalAgenda={totalAgenda}
            />
          ))}
        </div>
      }
    </div>
  );
}
