'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './columns';
import {
  SelectAgendaRecurrence,
  SelectAgendaRecurrenceWithCoachAndClass,
  SelectClass,
  SelectClassType,
  SelectCoachWithUser,
  SelectLocation,
  SelectStatistic,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllStatisticSchema } from '@repo/shared/api/schema';
import CreateForm from './create.form';
import { DAYS } from './constant';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DayPicker from './_components/day-picker';

interface TableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
  search: z.infer<typeof findAllStatisticSchema>;
}

export default function Table({
  locations,
  coaches,
  classes,
  search,
}: TableProps) {
  const [{ result, error }] =
    api.agenda.findAllAgendaRecurrence.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dayOfWeek, setDayOfWeek] = React.useState<number>(0);

  const onDayOfWeekChange = (dayOfWeek: number) => {
    setDayOfWeek(dayOfWeek);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('day_of_week', dayOfWeek.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const columns = React.useMemo(
    () =>
      getColumns({
        locations,
        coaches,
        classes,
      }),
    [],
  );

  const filterFields: DataTableFilterField<SelectAgendaRecurrenceWithCoachAndClass>[] =
    [
      {
        label: 'Lokasi',
        value: 'location_name',
        options: locations.map((location) => ({
          label: location.name,
          value: location.id.toString(),
          withCount: true,
        })),
      },
      {
        label: 'Instruktur',
        value: 'coach_name',
        options: coaches.map((coach) => ({
          label: coach.name,
          value: coach.id.toString(),
          withCount: true,
        })),
      },
    ];

  const { table } = useDataTable({
    data: result?.data ?? [],
    columns,
    pageCount: result?.pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'class_name.desc',
    visibleColumns: {
      day_of_week: false,
    },
  });

  return (
    <DataTable table={table}>
      <DayPicker dayOfWeek={dayOfWeek} setDayOfWeek={onDayOfWeekChange} />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateForm classes={classes} coaches={coaches} locations={locations} />
      </DataTableToolbar>
    </DataTable>
  );
}
