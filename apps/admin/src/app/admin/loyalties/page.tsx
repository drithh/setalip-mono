import { FindAllLoyaltyOptions } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import LoyaltyTable from './_components/loyalty-table';
import { TYPES, container } from '@repo/shared/inversify';
import {
  LoyaltyService,
  PackageService,
  UserService,
} from '@repo/shared/service';
import { findAllLoyaltySchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import LoyaltyRewardTable from './_components/loyalty-reward-table';
import LoyaltyShopTable from './_components/loyalty-shop-table';

export interface IndexPageProps {
  searchParams: Promise<FindAllLoyaltyOptions>;
}

export default async function Loyaltys(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = findAllLoyaltySchema.parse(searchParams);
  const packageService = container.get<PackageService>(TYPES.PackageService);
  const packages = await packageService.findAll({
    is_active: 0,
    perPage: 100,
  });

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);
  const loyaltyShops = await loyaltyService.findAllShop({
    perPage: 100,
  });

  const userService = container.get<UserService>(TYPES.UserService);
  const users = await userService.findAllUserName();

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Shop</CardTitle>
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
              <LoyaltyShopTable
                packages={packages.result?.data ?? []}
                search={search}
              />
            </React.Suspense>
          </QueryResetBoundary>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty Reward</CardTitle>
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
              <LoyaltyRewardTable
                search={{
                  ...search,
                  per_page: 100,
                }}
              />
            </React.Suspense>
          </QueryResetBoundary>
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
              <LoyaltyTable
                users={users.result ?? []}
                shops={loyaltyShops.result?.data ?? []}
                search={search}
              />
            </React.Suspense>
          </QueryResetBoundary>
        </CardContent>
      </Card>
    </main>
  );
}
