'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './columns';
import { SelectClassType, SelectStatistic } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllStatisticSchema } from '@repo/shared/api/schema';
import CreateForm from './create.form';
import { ROLES } from './constant';

interface TableProps {
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllStatisticSchema>;
}

export default function Table({ classTypes, search }: TableProps) {
  const [{ result, error }] = api.statistic.findAll.useSuspenseQuery(
    search,
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () => getColumns({ classTypes: classTypes }),
    [],
  );

  const filterFields: DataTableFilterField<SelectStatistic>[] = [
    {
      label: 'Nama',
      value: 'name',
      placeholder: 'Filter nama...',
    },
    {
      label: 'Role',
      value: 'role',
      options: ROLES.map((role) => ({
        label: role,
        value: role,
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
    defaultSort: 'created_at.desc',
    visibleColumns: {
      created_at: false,
      updated_at: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateForm />
      </DataTableToolbar>
    </DataTable>
  );
}
