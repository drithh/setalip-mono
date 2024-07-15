'use client';

import { SelectDetailLocation } from '@repo/shared/repository';
import { Input } from '@repo/ui/components/ui/input';
import { Separator } from '@repo/ui/components/ui/separator';
import { useRef } from 'react';
interface OperationalHourProps {
  operationalHours: SelectDetailLocation['operational_hours'];
}

export default function OperationalHour({
  operationalHours,
}: OperationalHourProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const mapDayOfWeek = (dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 0:
        return 'Senin';
      case 1:
        return 'Selasa';
      case 2:
        return 'Rabu';
      case 3:
        return 'Kamis';
      case 4:
        return 'Jumat';
      case 5:
        return 'Sabtu';
      case 6:
        return 'Minggu';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {operationalHours.map((openingHour, index) => {
        // 02:07:19

        // strip second
        const openingDate = openingHour.opening_time
          .split(':')
          .slice(0, 2)
          .join(':');
        const closingDate = openingHour.closing_time
          .split(':')
          .slice(0, 2)
          .join(':');

        return (
          <div key={index}>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-lg  ">
                {mapDayOfWeek(openingHour.day_of_week)}
              </div>

              <div className="ml-auto flex items-center justify-center gap-2">
                <Input
                  readOnly
                  type="text"
                  className="w-[72px] text-center"
                  defaultValue={openingDate}
                />

                <span className="text-sm">Sampai</span>

                <Input
                  readOnly
                  type="text"
                  className="w-[72px] text-center"
                  defaultValue={closingDate}
                />
              </div>
            </div>

            {index !== operationalHours.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
