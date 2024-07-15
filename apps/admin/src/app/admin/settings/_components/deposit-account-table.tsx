'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './deposit-account-colums';
import { SelectDepositAccount } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllDepositAccountSchema } from '@repo/shared/api/schema';
import CreateDepositAccountForm from '../create-deposit-account.form';

interface DepositAccountTableProps {
  search: z.infer<typeof findAllDepositAccountSchema>;
}

export default function DepositAccountTable({
  search,
}: DepositAccountTableProps) {
  const [{ result, error }] =
    api.webSetting.findAllDepositAccount.useSuspenseQuery(
      {
        ...search,
        per_page: 100,
      },
      {},
    );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(() => getColumns({}), []);

  const filterFields: DataTableFilterField<SelectDepositAccount>[] = [
    {
      label: 'Name',
      value: 'name',
      placeholder: 'Filter nama...',
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
        <CreateDepositAccountForm />
      </DataTableToolbar>
    </DataTable>
  );
}
