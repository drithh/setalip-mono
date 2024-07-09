'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './columns';
import {
  SelectClassType,
  SelectLocation,
  SelectUser,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllUserSchema } from '@repo/shared/api/schema';
// import CreateUserForm from './create-user.form';
import { roles } from '../form-schema';

interface UserTableProps {
  locations: SelectLocation[];
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllUserSchema>;
}

export default function UserTable({
  locations,
  classTypes,
  search,
}: UserTableProps) {
  const [{ result, error }] = api.user.findAll.useSuspenseQuery(search, {});
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const users =
    result?.data.map((user) => ({
      id: user.id,
      name: user.name,
    })) ?? [];

  const columns = React.useMemo(
    () =>
      getColumns({
        locations: locations,
        classTypes: classTypes,
        users: users,
      }),
    [],
  );

  const filterFields: DataTableFilterField<SelectUser>[] = [
    {
      label: 'Nama',
      value: 'name',
      placeholder: 'Filter nama...',
    },
    {
      label: 'Role',
      value: 'role',
      options: roles.map((role) => ({
        label: role,
        value: role,
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
      verified_at: false,
      updated_at: false,
      updated_by: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        {/* <CreateUserForm locations={locations} /> */}
      </DataTableToolbar>
    </DataTable>
  );
}
