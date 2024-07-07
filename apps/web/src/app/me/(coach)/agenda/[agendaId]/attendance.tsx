'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import { DatePicker } from '@repo/ui/components/date-picker';
import { getColumns } from './columns';
import {
  SelectClassType,
  SelectAgenda,
  SelectAgendaWithCoachAndClass,
  SelectLocationAgenda,
  SelectCoachAgenda,
  SelectLocation,
  SelectCoach,
  SelectCoachWithUser,
  SelectClass,
  SelectAllClass,
  SelectAllAgendaByUser,
  SelectAllSchedule,
  SelectBookingParticipant,
} from '@repo/shared/repository';
import { api } from '@/trpc/react';
import { z } from 'zod';
import {
  findAllCoachAgendaSchema,
  findAllUserAgendaSchema,
} from '@repo/shared/api/schema';
import { Form } from '@repo/ui/components/ui/form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  participants: SelectBookingParticipant[];
}

export default function AgendaTable({ participants }: AgendaTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: participants ?? [],
    columns,
    pageCount: -1,
    defaultPerPage: 10,
    defaultSort: 'name.asc',
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
