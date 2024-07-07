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
  SelectAllPackage,
  SelectAllPackageTransaction,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllPackageTransactionByUserIdSchema } from '@repo/shared/api/schema';
import { Form } from '@repo/ui/components/ui/form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import CreatePackageTransactionForm from './create-packageTransaction.form';

interface PackageTransactionTableProps {
  search: z.infer<typeof findAllPackageTransactionByUserIdSchema>;
}

export default function PackageTransactionTable({
  search,
}: PackageTransactionTableProps) {
  const [{ result, error }] =
    api.package.findAllPackageTransactionByUserId.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = React.useMemo(() => getColumns(), []);

  const statues = [
    'completed',
    'pending',
    'failed',
  ] satisfies SelectAllPackageTransaction['data'][0]['status'][];

  const filterFields: DataTableFilterField<
    SelectAllPackageTransaction['data'][0]
  >[] = [
    {
      label: 'Status',
      value: 'status',
      options: statues.map((status) => ({
        label: status,
        value: status,
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
    defaultSort: 'package_expired_at.desc',
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
