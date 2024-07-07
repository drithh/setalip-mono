'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './carousel-colums';
import { SelectClassType, SelectCarousel } from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import CreateCarouselForm from '../create-carousel.form';

interface CarouselTableProps {}

export default function CarouselTable({}: CarouselTableProps) {
  const [{ result, error }] = api.webSetting.findAllCarousel.useSuspenseQuery(
    void {},
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(() => getColumns({}), []);

  const filterFields: DataTableFilterField<SelectCarousel>[] = [
    // {
    //   label: 'Name',
    //   value: 'name',
    //   placeholder: 'Filter nama...',
    // },
  ];

  const { table } = useDataTable({
    data: result ?? [],
    columns,
    pageCount: -1,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'created_at.desc',
    visibleColumns: {},
  });

  return (
    <DataTable table={table} pagination={false}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateCarouselForm />
      </DataTableToolbar>
    </DataTable>
  );
}
