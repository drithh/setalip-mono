'use client';

import { findAllUserCreditSchema } from '@repo/shared/api/schema';
import {
  SelectCreditPagination,
  SelectClassType,
  SelectCredit,
} from '@repo/shared/repository';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import type { DataTableFilterField } from '@repo/ui/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

import { useDataTable } from '@/hooks/use-data-table';
import { api } from '@/trpc/react';

import { getColumns } from './columns';
import { userSchema } from '../form-schema';
// import CreateCreditTransactionForm from './create-creditTransaction.form';

interface CreditTransactionTableProps {
  search: z.infer<typeof findAllUserCreditSchema>;
  params: z.infer<typeof userSchema>;
  classTypes: SelectClassType[];
}

export default function CreditTransactionTable({
  search,
  params,
  classTypes,
}: CreditTransactionTableProps) {
  const [{ result, error }] =
    api.credit.findAllByUserId__Admin.useSuspenseQuery(
      {
        ...search,
        user_id: params.userId,
      },
      {},
    );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = React.useMemo(
    () =>
      getColumns({
        classTypes,
      }),
    [],
  );

  // const creditTypes = ['credit', 'debit'] satisfies SelectCredit['type'][];

  const filterFields: DataTableFilterField<SelectCredit>[] = [
    // {
    //   label: 'Type',
    //   value: 'type',
    //   options: creditTypes.map((type) => ({
    //     label: type,
    //     value: type,
    //     withCount: true,
    //   })),
    // },
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
