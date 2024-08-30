import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import PackageTransactionTable from './_components/package-transaction-table';
import { findAllPackageTransactionSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';
import 'react-photo-view/dist/react-photo-view.css';

export interface IndexPageProps {
  searchParams: any;
}

export default async function PackageTransactions({
  searchParams,
}: IndexPageProps) {
  const search = findAllPackageTransactionSchema.parse(searchParams);

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
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
          <PackageTransactionTable search={search} />
        </React.Suspense>
      </QueryResetBoundary>
    </main>
  );
}
