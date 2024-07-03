'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

import { getColumns } from './faq-columns';
import {
  SelectClassType,
  SelectFrequentlyAskedQuestion,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { findAllFrequentlyAskedQuestionSchema } from '@repo/shared/api/schema';
import CreateFrequentlyAskedQuestionForm from '../create-faq.form';

interface FrequentlyAskedQuestionTableProps {
  search: z.infer<typeof findAllFrequentlyAskedQuestionSchema>;
}

export default function FrequentlyAskedQuestionTable({
  search,
}: FrequentlyAskedQuestionTableProps) {
  const [{ result, error }] =
    api.webSetting.findAllFrequentlyAskedQuestion.useSuspenseQuery(
      {
        ...search,
        per_page: 100,
      },
      {},
    );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const columns = React.useMemo(() => getColumns({}), []);

  const filterFields: DataTableFilterField<SelectFrequentlyAskedQuestion>[] = [
    {
      label: 'Question',
      value: 'question',
      placeholder: 'Filter pertanyaan...',
    },
  ];

  const { table } = useDataTable({
    data: result?.data ?? [],
    columns,
    pageCount: result?.pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'created_at.asc',
    visibleColumns: {},
  });

  return (
    <DataTable table={table} pagination={false}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateFrequentlyAskedQuestionForm />
      </DataTableToolbar>
    </DataTable>
  );
}
