'use client';

import { findAllScheduleSchema } from '@repo/shared/api/schema';
import {
  SelectAllClass,
  SelectClassType,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import { DatePicker } from '@repo/ui/components/date-picker';
import type { DataTableFilterField } from '@repo/ui/types';
import { parse } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

import { useDataTable } from '@/hooks/use-data-table';
import { api } from '@/trpc/react';

import { getColumns } from './columns';
import DayPicker from './day-picker';
import { SelectAgenda__Coach__Class__Location } from '@repo/shared/service';

interface AgendaTableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classTypes: SelectClassType[];
  classes: SelectAllClass['data'];
  search: z.infer<typeof findAllScheduleSchema>;
  defaultLocation?: number;
}

export default function AgendaTable({
  locations,
  coaches,
  classTypes,
  classes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAllSchedule.useSuspenseQuery(
    search,
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }
  const columns = React.useMemo(() => getColumns(), []);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const convertDate = (date: string) => parse(date, 'yyyy-MM-dd', new Date());
  const defaultDate = search.date ? convertDate(search.date) : new Date();
  const [date, setDate] = React.useState<Date>(defaultDate);

  const onDateChange = (date: Date) => {
    setDate(date);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    const stringDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;
    newSearchParams.set('date', stringDate);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filterFields: DataTableFilterField<SelectAgenda__Coach__Class__Location>[] =
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
        label: 'Kelas',
        value: 'class_name',
        options: classes.map((singleClass) => ({
          label: singleClass.name,
          value: singleClass.id.toString(),
          withCount: true,
        })),
      },
      {
        label: 'Tipe Kelas',
        value: 'class_type_name',
        options: classTypes.map((classType) => ({
          label: classType.type,
          value: classType.id.toString(),
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
    defaultSort: 'time.asc',
    visibleColumns: {},
  });

  return (
    <DataTable table={table}>
      <>
        <DayPicker date={date} setDate={onDateChange} />
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          className="flex-col sm:flex-row"
        >
          <DatePicker
            selected={date}
            setSelected={onDateChange}
            onDateChange={onDateChange}
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
          />
        </DataTableToolbar>
      </>
    </DataTable>
  );
}
