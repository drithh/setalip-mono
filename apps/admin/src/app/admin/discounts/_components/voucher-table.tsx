'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './voucher-columns';
import {
  SelectAllUserName,
  SelectVoucherWithUser,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllVoucherSchema } from '@repo/shared/api/schema';
import CreateVoucherForm from '../create-voucher.form';

interface VoucherTableProps {
  search: z.infer<typeof findAllVoucherSchema>;
  users: SelectAllUserName;
}

export default function VoucherTable({ search, users }: VoucherTableProps) {
  const [{ result, error }] = api.voucher.findAll.useSuspenseQuery(
    {
      ...search,
      per_page: 100,
    },
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(() => getColumns({ users: users }), []);

  const filterFields: DataTableFilterField<SelectVoucherWithUser>[] = [
    {
      label: 'Name',
      value: 'name',
      placeholder: 'Filter name...',
    },
    {
      label: 'Code',
      value: 'code',
      placeholder: 'Filter code...',
    },
  ];

  const { table } = useDataTable({
    data: result?.data ?? [],
    columns,
    pageCount: result?.pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'created_at.desc',
    visibleColumns: {},
  });

  return (
    <DataTable table={table} pagination={false}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateVoucherForm users={users} />
      </DataTableToolbar>
    </DataTable>
  );
}
