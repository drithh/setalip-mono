'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './columns';
import { SelectClassType, SelectPackage } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllPackageSchema } from '@repo/shared/api/schema';
import CreatePackageForm from '../create-package.form';

interface PackageTableProps {
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllPackageSchema>;
}

export default function PackageTable({
  classTypes,
  search,
}: PackageTableProps) {
  const [{ result, error }] = api.package.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(
    () => getColumns({ classTypes: classTypes }),
    [],
  );

  const filterFields: DataTableFilterField<SelectPackage>[] = [
    {
      label: 'Nama',
      value: 'name',
      placeholder: 'Filter nama...',
    },
    {
      label: 'Tipe Kelas',
      value: 'class_type_id',
      options: classTypes.map(({ id, type }) => ({
        label: type,
        value: id.toString(),
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
    visibleColumns: {
      updated_at: false,
      updated_by: false,
      one_time_only: false,
      loyalty_points: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreatePackageForm classTypes={classTypes} />
      </DataTableToolbar>
    </DataTable>
  );
}
