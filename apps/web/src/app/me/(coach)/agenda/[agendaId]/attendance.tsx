'use client';

import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';

import { getColumns } from './columns';
import { AgendaWithParticipant } from '@repo/shared/service';
// import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  participants: AgendaWithParticipant[];
}

export default function AgendaTable({ participants }: AgendaTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: participants ?? [],
    columns,
    pageCount: -1,
    defaultPerPage: 10,
    defaultSort: 'user_name.asc',
    visibleColumns: {},
  });

  const convertDate = (date: string) => {
    return new Date(`${date}T00:00:00`);
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        // filterFields={filterFields}
        className="flex-col sm:flex-row"
      ></DataTableToolbar>
    </DataTable>
  );
}
