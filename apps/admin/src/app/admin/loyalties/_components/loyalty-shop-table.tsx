'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './loyalty-shop-columns';
import {
  SelectAllLoyaltyShop,
  SelectAllPackage,
  SelectPackages,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllLoyaltyShopSchema } from '@repo/shared/api/schema';
import CreateLoyaltyShopForm from '../create-loyalty-shop.form';

interface LoyaltyShopTableProps {
  packages: SelectPackages[];
  search: z.infer<typeof findAllLoyaltyShopSchema>;
}

export default function LoyaltyShopTable({
  packages,
  search,
}: LoyaltyShopTableProps) {
  const [{ result, error }] = api.loyalty.findAllShop.useSuspenseQuery(
    search,
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () =>
      getColumns({
        packages,
      }),
    [],
  );

  const filterFields: DataTableFilterField<
    SelectAllLoyaltyShop['data'][number]
  >[] = [
    // {
    //   label: 'Nama',
    //   value: 'user_name',
    //   placeholder: 'Filter nama...',
    // },
    // {
    //   label: 'Type',
    //   value: 'type',
    //   options: types.map((type) => ({
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
    visibleColumns: {
      created_at: false,
      updated_at: false,
    },
  });

  return (
    <DataTable table={table} pagination={false}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateLoyaltyShopForm packages={packages} />
      </DataTableToolbar>
    </DataTable>
  );
}
