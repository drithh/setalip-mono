'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './review-columns';
import {
  SelectAllUserName,
  SelectReviewWithUser,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllReviewSchema } from '@repo/shared/api/schema';
import CreateReviewForm from '../create-review.form';

interface ReviewTableProps {
  search: z.infer<typeof findAllReviewSchema>;
  users: SelectAllUserName;
}

export default function ReviewTable({ search, users }: ReviewTableProps) {
  const [{ result, error }] = api.webSetting.findAllReview.useSuspenseQuery(
    {
      ...search,
      per_page: 100,
    },
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(() => getColumns({ users: users }), []);

  const filterFields: DataTableFilterField<SelectReviewWithUser>[] = [
    {
      label: 'Email',
      value: 'email',
      placeholder: 'Filter email...',
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
        <CreateReviewForm users={users} />
      </DataTableToolbar>
    </DataTable>
  );
}
