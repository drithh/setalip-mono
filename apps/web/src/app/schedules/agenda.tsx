'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import { DatePicker } from '@repo/ui/components/date-picker';
import { getColumns } from './columns';
import {
  SelectClassType,
  SelectAgenda,
  SelectAgendaWithCoachAndClass,
  SelectLocationAgenda,
  SelectCoachAgenda,
  SelectLocation,
  SelectCoach,
  SelectCoachWithUser,
  SelectClass,
  SelectAllClass,
  SelectScheduleByDate,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllScheduleSchema } from '@repo/shared/api/schema';
import { Form } from '@repo/ui/components/ui/form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllScheduleSchema>;
}

export default function AgendaTable({
  locations,
  coaches,
  classTypes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAllSchedule.useSuspenseQuery(
    search,
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = React.useMemo(() => getColumns(), []);

  const onDateChange = (date: Date) => {
    // search params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // remove timzone in date
    const stringDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;
    newSearchParams.set('date', stringDate);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filterFields: DataTableFilterField<SelectScheduleByDate>[] = [
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

  const convertDate = (date: string) => {
    return new Date(`${date}T00:00:00`);
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <DatePicker
          defaultDate={search.date ? convertDate(search.date) : new Date()}
          onDateChange={onDateChange}
          disabled={(date) => date < new Date()}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
