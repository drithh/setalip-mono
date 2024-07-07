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
  SelectLocation,
  SelectCoachWithUser,
  SelectAllCredit,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllUserCreditSchema } from '@repo/shared/api/schema';
import { Form } from '@repo/ui/components/ui/form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import CreateCreditTransactionForm from './create-creditTransaction.form';

interface CreditTransactionTableProps {
  search: z.infer<typeof findAllUserCreditSchema>;
}

export default function CreditTransactionTable({
  search,
}: CreditTransactionTableProps) {
  const [{ result, error }] = api.credit.findAllByUserId.useSuspenseQuery(
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

  const creditTypes = [
    'credit',
    'debit',
  ] satisfies SelectAllCredit['data'][0]['type'][];

  const filterFields: DataTableFilterField<SelectAllCredit['data'][0]>[] = [
    {
      label: 'Type',
      value: 'type',
      options: creditTypes.map((type) => ({
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
    visibleColumns: {},
  });

  const convertDate = (date: string) => {
    return new Date(`${date}T00:00:00`);
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        className="flex-col sm:flex-row"
      ></DataTableToolbar>
    </DataTable>
  );
}
