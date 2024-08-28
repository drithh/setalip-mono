'use client';
import { SelectStatistic } from '@repo/shared/repository';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { HexagonSvg } from './hexagon';
import { UnlockIcon } from 'lucide-react';
import RichTextViewer from '@repo/ui/components/rich-text/viewer';

interface StatisticDialogProps {
  statistic: SelectStatistic;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function StatisticDialog({
  statistic,
  isOpen,
  onOpenChange,
}: StatisticDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{statistic.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center overflow-hidden">
          <div className={`relative h-52 w-44 `}>
            <HexagonSvg className={`fill-white/90 drop-shadow-lg`} />
            <HexagonSvg
              className={`absolute inset-0 top-2  mx-auto my-auto h-[196px] w-[164px] cursor-pointer border-white fill-[#7A8466] stroke-white text-white opacity-100 `}
            />
            <div
              className={`absolute inset-0 top-8 mx-auto flex h-9 w-9 cursor-pointer place-items-center justify-center  rounded-full border-2 border-white fill-[#7A8466] stroke-white text-white opacity-100`}
            >
              <UnlockIcon className="h-6 w-6 " />
            </div>
            <div
              className={`absolute inset-0 top-3 my-auto w-full cursor-pointer place-content-center place-items-center border-white fill-[#7A8466] stroke-white px-4 text-white opacity-100 `}
            >
              <p className="text-center text-2xl font-bold italic leading-6 ">
                {statistic.point}
              </p>
              <p className="text-center text-2xl font-bold italic leading-6 ">
                Class Reward
              </p>
            </div>
          </div>
        </div>
        <RichTextViewer
          value={statistic.description ?? ''}
          className="h-full border-none"
        />
      </DialogContent>
    </Dialog>
  );
}
