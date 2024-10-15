'use client';

import { SelectAgenda__Coach__Class__Location } from '@repo/shared/service';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';
import * as React from 'react';

export function getColumns(): ColumnDef<SelectAgenda__Coach__Class__Location>[] {
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
              {format(new Date(row.original.time), 'MMM dd - HH:mm')}
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
      accessorKey: 'class_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kelas" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          <span className="inline-block font-semibold sm:hidden">
            Kelas :&ensp;
          </span>
          {row.original.class_name}
        </div>
      ),
    },
    {
      accessorKey: 'class_type_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipe" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          <span className="inline-block font-semibold sm:hidden">
            Type :&ensp;
          </span>
          <Badge>{row.original.class_type_name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'coach_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instruktur" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            <span className="inline-block font-semibold sm:hidden">
              Instructor :&ensp;
            </span>
            {row.original.coach_name}
          </div>
        );
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
          <p className="sm:-ml-5 sm:text-center">
            <span className="inline-block font-semibold sm:hidden">
              Participant :&ensp;
            </span>
            {row.original.participant} / {row.original.class_slot}
          </p>
        );
      },
    },

    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (row.original?.participant ?? 0) >= row.original.class_slot ? (
          <Button
            variant={'outline'}
            className="w-full cursor-not-allowed  hover:text-primary-foreground"
          >
            Full
          </Button>
        ) : (
          <Link
            href={`/schedules/${row.original.id ?? 0}?agenda_recurrence_id=${row.original.agenda_recurrence_id}&time=${row.original.time}`}
          >
            <Button className="w-full" variant="default">
              Join Class
            </Button>
          </Link>
        );
      },
    },
  ];
}
