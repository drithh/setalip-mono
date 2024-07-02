'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

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
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllAgendaSchema } from '@repo/shared/api/schema';
import CreateAgendaForm from '../create-agenda.form';

interface AgendaTableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
  search: z.infer<typeof findAllAgendaSchema>;
}

export default function AgendaTable({
  locations,
  coaches,
  classes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () => getColumns({ locations, coaches, classes }),
    [],
  );

  const filterFields: DataTableFilterField<SelectAgendaWithCoachAndClass>[] = [
    {
      label: 'Nama Kelas',
      value: 'class_name',
      placeholder: 'Filter nama kelas...',
    },
    {
      label: 'Lokasi',
      value: 'location_id',
      options: locations.map((location) => ({
        label: location.name,
        value: location.id.toString(),
        withCount: true,
      })),
    },
    {
      label: 'Instruktur',
      value: 'coach_id',
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
    defaultSort: 'created_at.asc',
    visibleColumns: {
      created_at: false,
      updated_at: false,
      updated_by: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateAgendaForm
          coaches={coaches}
          locations={locations}
          classes={classes}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
