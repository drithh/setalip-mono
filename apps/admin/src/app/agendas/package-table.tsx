'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './columns';
import { SelectClassType, SelectAgenda } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllAgendaSchema } from '@repo/shared/api/schema';
import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllAgendaSchema>;
}

export default function AgendaTable({ classTypes, search }: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () => getColumns({ classTypes: classTypes }),
    [],
  );

  const filterFields: DataTableFilterField<SelectAgenda>[] = [
    {
      label: 'Nama',
      value: 'name',
      placeholder: 'Filter nama...',
    },
    {
      label: 'Tipe Kelas',
      value: 'class_type_id',
      options: classTypes.map(({ id, type }) => ({
        label: type,
        value: id.toString(),
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
      updated_at: false,
      updated_by: false,
      one_time_only: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateAgendaForm classTypes={classTypes} />
      </DataTableToolbar>
    </DataTable>
  );
}
