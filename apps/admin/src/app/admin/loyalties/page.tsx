import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FindAllLoyaltyOptions, SelectLoyalty } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import LoyaltyTable from './_components/loyalty-table';
import { TYPES, container } from '@repo/shared/inversify';
import { ClassTypeService, UserService } from '@repo/shared/service';
import { findAllLoyaltySchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import DepositAccountTable from '../settings/_components/deposit-account-table';

export interface IndexPageProps {
  searchParams: FindAllLoyaltyOptions;
}

export default async function Loyaltys({ searchParams }: IndexPageProps) {
  const search = findAllLoyaltySchema.parse(searchParams);

  const userService = container.get<UserService>(TYPES.UserService);
  const users = await userService.findAllUserName();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Wip</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty Transaction</CardTitle>
        </CardHeader>
        <CardContent>
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
              <LoyaltyTable users={users.result ?? []} search={search} />
            </React.Suspense>
          </QueryResetBoundary>
        </CardContent>
      </Card>
    </main>
  );
}
