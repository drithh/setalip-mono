'use client';

import { findAllUserAgendaSchema } from '@repo/shared/api/schema';
import {
  SelectClassType,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';
import type { DataTableFilterField } from '@repo/ui/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

import { useDataTable } from '@/hooks/use-data-table';
import { api } from '@/trpc/react';

import { getColumns } from './columns';
import { SelectAgenda__Coach__Class__Location__AgendaBooking } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@repo/ui/lib/utils';
// import CreateAgendaForm from './create-agenda.form';

interface AgendaTableProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classTypes: SelectClassType[];
  search: z.infer<typeof findAllUserAgendaSchema>;
}

export default function AgendaTable({
  locations,
  coaches,
  classTypes,
  search,
}: AgendaTableProps) {
  const [{ result, error }] = api.agenda.findAllUserAgenda.useSuspenseQuery(
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

  const tab = search.tab ?? 'upcoming';

  const tabs = ['upcoming', 'past'];
  const onTabClick = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tab);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filterFields: DataTableFilterField<SelectAgenda__Coach__Class__Location__AgendaBooking>[] =
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
      {
        label: 'Instruktur',
        value: 'coach_name',
        options: coaches.map((coach) => ({
          label: coach.name,
          value: coach.id.toString(),
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
      <div className="grid grid-cols-2 gap-4 rounded-lg  bg-primary/30 p-2 sm:max-w-fit">
        {tabs.map((singleTab) => (
          <Button
            variant={'ghost'}
            key={singleTab}
            className={cn(
              'rounded-lg px-4 py-2 capitalize hover:bg-primary/70 hover:text-primary-foreground/70 ',
              singleTab == tab &&
                'bg-primary hover:bg-primary/90 hover:text-primary-foreground',
            )}
            onClick={() => onTabClick(singleTab)}
          >
            <p className="capitalize">{singleTab}</p>
          </Button>
        ))}
      </div>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        className="flex-col sm:flex-row"
      ></DataTableToolbar>
    </DataTable>
  );
}
