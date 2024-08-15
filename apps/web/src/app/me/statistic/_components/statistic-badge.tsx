'use client';

import { SelectStatistic } from '@repo/shared/repository';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { HexagonSvg } from './hexagon';
import StatisticDialog from './statistic-dialog';
import { useState } from 'react';

interface StatisticBadgeProps {
  statistic: SelectStatistic;
  totalAgenda: number;
}

export const StatisticBadge = ({
  statistic,
  totalAgenda,
}: StatisticBadgeProps) => {
  const variant = totalAgenda >= statistic?.point ? 'unlocked' : 'locked';
  const [isOpen, setIsOpen] = useState(false);
  const variantClass =
    variant === 'locked'
      ? 'opacity-80 fill-neutral-100 text-neutral-500 cursor-not-allowed border-black/50 stroke-border'
      : 'opacity-100 fill-[#7A8466] text-white cursor-pointer border-white stroke-white';

  return (
    <div className="mb-4 flex flex-col items-center justify-center overflow-hidden">
      <StatisticDialog
        statistic={statistic}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
      <div
        className={`relative h-52 w-44 md:h-72 md:w-64`}
        {...(variant === 'locked' ? {} : { onClick: () => setIsOpen(true) })}
      >
        <HexagonSvg className={`fill-white/90 drop-shadow-lg`} />
        <HexagonSvg
          className={`top-2 h-[196px] w-[164px]  md:h-[290px] md:w-[250px] ${variantClass} absolute inset-0 mx-auto my-auto md:top-6`}
        />
        <div
          className={`${variantClass} absolute inset-0 top-8 mx-auto  flex h-9 w-9 place-items-center justify-center rounded-full border-2 md:h-12 md:w-12`}
        >
          {variant === 'locked' ? (
            <LockIcon className="h-6 w-6 md:h-8 md:w-8 " />
          ) : (
            <UnlockIcon className="h-6 w-6 md:h-8 md:w-8 " />
          )}
        </div>
        <div
          className={`absolute inset-0 top-3 my-auto w-full place-content-center place-items-center px-4 md:top-0 md:px-8 ${variantClass}`}
        >
          <p className="text-center text-2xl font-bold italic leading-6 md:text-[3rem] md:leading-[1.02]">
            {statistic.point}
          </p>
          <p className="text-center text-2xl font-bold italic leading-6 md:text-[3rem] md:leading-9">
            Class Reward
          </p>
        </div>
      </div>
      <p className="w-44 text-center text-xl font-bold uppercase text-black/50 md:w-64 md:text-[1.7rem]">
        {statistic.name}
      </p>
    </div>
  );
};
