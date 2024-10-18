'use client';

import { findAllPackageTransactionByUserIdSchema } from '@repo/shared/api/schema';
import {} from '@repo/shared/repository';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import type { DataTableFilterField } from '@repo/ui/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

import { useDataTable } from '@/hooks/use-data-table';
import { api } from '@/trpc/react';

import { getColumns } from './columns';
import { SelectPackageTransaction__Package__UserPackage } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@repo/ui/lib/utils';
// import CreatePackageTransactionForm from './create-packageTransaction.form';

interface PackageTransactionTableProps {
  search: z.infer<typeof findAllPackageTransactionByUserIdSchema>;
}

export default function PackageTransactionTable({
  search,
}: PackageTransactionTableProps) {
  const [{ result, error }] =
    api.package.findAllPackageTransactionByUserId.useSuspenseQuery(
      {
        ...search,
        status: search.status ?? 'completed',
      },
      {},
    );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = search.status ?? 'completed';
  const statuses = ['completed', 'pending', 'failed', 'expired'];
  const columns = React.useMemo(
    () =>
      getColumns({
        isPending: search.status === 'pending',
      }),
    [search.status],
  );

  const onTabClick = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('status', tab);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filterFields: DataTableFilterField<SelectPackageTransaction__Package__UserPackage>[] =
    [];

  const { table } = useDataTable({
    data: result?.data ?? [],
    columns,
    pageCount: result?.pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'user_package_expired_at.desc',
    visibleColumns: {},
  });

  const convertDate = (date: string) => {
    return new Date(`${date}T00:00:00`);
  };

  return (
    <DataTable table={table}>
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-primary/30  p-2 sm:max-w-fit md:grid-cols-4">
        {statuses.map((singleStatus) => (
          <Button
            variant={'ghost'}
            key={singleStatus}
            className={cn(
              'rounded-lg px-4 py-2 capitalize hover:bg-primary/70 hover:text-primary-foreground/70 ',
              singleStatus == status &&
                'bg-primary hover:bg-primary/90 hover:text-primary-foreground',
            )}
            onClick={() => onTabClick(singleStatus)}
          >
            <p className="capitalize">
              {singleStatus === 'completed' ? 'active' : singleStatus}
            </p>
          </Button>
        ))}
      </div>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        className="flex-col sm:flex-row"
      ></DataTableToolbar>
    </DataTable>
  );
}
