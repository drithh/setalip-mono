import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FindAllVoucherOptions, SelectVoucher } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import { TYPES, container } from '@repo/shared/inversify';
import { ClassTypeService, UserService } from '@repo/shared/service';
import { findAllVoucherSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';
import VoucherTable from './_components/voucher-table';

export interface IndexPageProps {
  searchParams: FindAllVoucherOptions;
}

export default async function Vouchers({ searchParams }: IndexPageProps) {
  const search = findAllVoucherSchema.parse(searchParams);

  const userService = container.get<UserService>(TYPES.UserService);
  const users = await userService.findAllUserName();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <QueryResetBoundary>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
              shrinkZero
            />
          }
        >
          <VoucherTable users={users.result ?? []} search={search} />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
