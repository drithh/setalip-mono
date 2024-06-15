'use client';

import * as React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { dateFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { SelectScheduleByDate } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';

export function getColumns(): ColumnDef<SelectScheduleByDate>[] {
  return [
    {
      accessorKey: 'time',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Waktu"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="-ml-5 flex flex-col place-items-center">
            <p className="font-semibold">
              {dateFormatter({
                year: undefined,
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(row.original.time)}
            </p>
            <p>({row.original.class_duration} menit)</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'location_name',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-40"
          column={column}
          title="Lokasi"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.location_name}, {row.original.location_facility_name}
        </div>
      ),
    },
    {
      accessorKey: 'class_type_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kelas" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.class_type_name}</div>
      ),
    },
    {
      accessorKey: 'coach_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instruktur" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.coach_name}</div>;
      },
    },
    {
      accessorKey: 'slot',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Slot"
        />
      ),

      cell: ({ row }) => {
        return (
          <p className="-ml-5 text-center">
            {row.original.participant} / {row.original.slot}
          </p>
        );
      },
    },

    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showEditAgendaSheet, setShowEditAgendaSheet] =
          React.useState(false);

        return (
          <>
            <Button
              variant="default"
              onClick={() => setShowEditAgendaSheet(true)}
            >
              Join Class
            </Button>
          </>
        );
      },
    },
  ];
}
