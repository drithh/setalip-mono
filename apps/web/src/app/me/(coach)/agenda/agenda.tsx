'use client';

import { findAllCoachAgendaSchema } from '@repo/shared/api/schema';
import { SelectClassType, SelectLocation } from '@repo/shared/repository';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import type { DataTableFilterField } from '@repo/ui/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

import { useDataTable } from '@/hooks/use-data-table';
import { api } from '@/trpc/react';

import { getColumns } from './columns';
import { SelectAgenda__Coach__Class__Location } from '@repo/shared/service';
// import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  locations: SelectLocation[];
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllCoachAgendaSchema>;
}

export default function AgendaTable({
  locations,
  classTypes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAllCoachAgenda.useSuspenseQuery(
    search,
    {},
  );
  if (error) {
    throw new Error('Error fetching data', error);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = React.useMemo(() => getColumns(), []);

  const onDateChange = (date: Date) => {
    // search params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // remove timzone in date
    const stringDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;
    newSearchParams.set('date', stringDate);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filterFields: DataTableFilterField<SelectAgenda__Coach__Class__Location>[] =
    [
      {
        label: 'Lokasi',
        value: 'location_name',
        options: locations.map((location) => ({
          label: location.name,
          value: location.id.toString(),
          withCount: true,
        })),
      },

      {
        label: 'Kelas',
        value: 'class_type_name',
        options: classTypes.map((classType) => ({
          label: classType.type,
          value: classType.id.toString(),
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
    defaultSort: 'time.desc',
    visibleColumns: {
      coach_id: false,
      location_id: false,
      class_type_id: false,
    },
  });

  const convertDate = (date: string) => {
    return new Date(`${date}T00:00:00`);
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        className="flex-col sm:flex-row"
      ></DataTableToolbar>
    </DataTable>
  );
}
