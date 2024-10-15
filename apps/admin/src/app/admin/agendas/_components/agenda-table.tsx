'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import { DatePicker } from '@repo/ui/components/date-picker';
import { getColumns } from './columns';
import {
  SelectLocation,
  SelectCoachWithUser,
  SelectClass,
  SelectClassType,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllAgendaSchema } from '@repo/shared/api/schema';
import CreateAgendaForm from '../create-agenda.form';
import DayPicker from './day-picker';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { parse } from 'date-fns';
import { SelectAgenda__Coach__Class__Location__Participant } from '@repo/shared/service';

interface AgendaTableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classTypes: SelectClassType[];
  classes: SelectClass[];
  search: z.infer<typeof findAllAgendaSchema>;
}

export default function AgendaTable({
  locations,
  coaches,
  classTypes,
  classes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () =>
      getColumns({
        locations,
        coaches,
        classes,
      }),
    [],
  );

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

  const filterFields: DataTableFilterField<SelectAgenda__Coach__Class__Location__Participant>[] =
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
    visibleColumns: {
      coach_id: false,
      created_at: false,
      updated_at: false,
      updated_by: false,
    },
  });

  return (
    <DataTable table={table}>
      <DayPicker date={date} setDate={onDateChange} />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <DatePicker
          selected={date}
          setSelected={onDateChange}
          onDateChange={onDateChange}
        />
        <CreateAgendaForm
          coaches={coaches}
          locations={locations}
          classes={classes}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
