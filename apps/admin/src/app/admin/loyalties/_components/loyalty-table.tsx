'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './loyalty-columns';
import {
  SelectAllLoyalty,
  SelectAllUserName,
  SelectLoyalty,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllLoyaltySchema } from '@repo/shared/api/schema';
import CreateLoyaltyForm from '../create-loyalty.form';
import DeleteLoyaltyForm from '../delete-loyalty.form';

interface PackageTableProps {
  users: SelectAllUserName;
  search: z.infer<typeof findAllLoyaltySchema>;
}

export default function PackageTable({ users, search }: PackageTableProps) {
  const [{ result, error }] = api.loyalty.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const types = ['debit', 'credit'] satisfies SelectLoyalty['type'][];

  const columns = React.useMemo(() => getColumns({ users: users }), []);

  const filterFields: DataTableFilterField<SelectAllLoyalty['data'][number]>[] =
    [
      {
        label: 'Nama',
        value: 'user_name',
        placeholder: 'Filter nama...',
      },
      {
        label: 'Type',
        value: 'type',
        options: types.map((type) => ({
          label: type,
          value: type,
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
      updated_at: false,
      updated_by: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateLoyaltyForm users={users} />
        <DeleteLoyaltyForm users={users} />
      </DataTableToolbar>
    </DataTable>
  );
}
