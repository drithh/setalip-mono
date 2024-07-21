import { container, TYPES } from '@repo/shared/inversify';
import { AgendaService, StatisticService } from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { validateUser } from '@/lib/auth';
import { Lock } from 'lucide-react';

export default async function Statistic({}: {}) {
  const auth = await validateUser();

  const role = auth.user.role === 'coach' ? 'coach' : 'user';

  const statisticService = container.get<StatisticService>(
    TYPES.StatisticService,
  );
  const statistics = await statisticService.findAll({
    perPage: 100,
    sort: 'point.asc',
    role: [role],
  });

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  let totalAgenda = 0;

  if (role === 'coach') {
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
    <div className="w-full p-6">
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
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {statistics.result?.data.map((stat) => (
            <StatisticBadge
              key={stat.id}
              name={stat.name}
              point={stat.point}
              variant={stat.point >= totalAgenda ? 'locked' : 'unlocked'}
            />
          ))}
        </div>
      }
    </div>
  );
}

interface StatisticBadgeProps {
  name: string;
  point: number;
  variant?: 'locked' | 'unlocked';
}

const StatisticBadge = ({
  name,
  point,
  variant = 'locked',
}: StatisticBadgeProps) => {
  const variantClass =
    variant === 'locked'
      ? 'opacity-80 fill-neutral-100 text-neutral-500 cursor-not-allowed'
      : 'opacity-100 fill-primary text-primary-500 cursor-pointer';

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className={`relative h-56 w-48 md:h-72 md:w-64`}>
        <HexagonSvg className={`drop-shadow-lg ${variantClass}`} />
        <div
          className={`absolute inset-0 my-auto h-full w-full place-content-center place-items-center px-4 md:px-8 ${variantClass}`}
        >
          <p className="text-center text-base font-semibold md:text-xl">
            {name}
          </p>
          <p className="text-center text-3xl font-bold md:text-[2.5rem]">
            {point}
          </p>
          <p className="text-center text-base font-semibold md:text-xl">
            Class Reward
          </p>
        </div>
      </div>
    </div>
  );
};
interface HexagonProps {
  className?: string;
}

const HexagonSvg = ({ className }: HexagonProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 -2 24 28"
  >
    <g>
      <path
        className="stroke-border"
        strokeWidth="0.25"
        d="m10.88544,0.68293c0.6932,-0.40144 1.53592,-0.40144 2.22912,0l8.03245,4.65211c0.72854,0.42197 1.18043,1.22255 1.18043,2.09144l0,9.14704c0,0.86884 -0.45188,1.6695 -1.18043,2.09141l-8.03245,4.65212c-0.6932,0.40146 -1.53592,0.40146 -2.22912,0l-8.03244,-4.65212c-0.72858,-0.42192 -1.18044,-1.22257 -1.18044,-2.09141l0,-9.14704c0,-0.86889 0.45186,-1.66947 1.18044,-2.09144l8.03244,-4.65211z"
      >
        asdasd
      </path>
    </g>
  </svg>
);
