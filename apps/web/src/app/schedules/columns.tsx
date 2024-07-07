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
import { SelectAllSchedule } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

export function getColumns(): ColumnDef<SelectAllSchedule['data'][0]>[] {
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
            {row.original.participant} / {row.original.slot}
          </p>
        );
      },
    },

    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (row.original?.participant ?? 0) >= row.original.slot ? (
          <Button
            variant={'outline'}
            className="w-full cursor-not-allowed  hover:text-primary-foreground"
          >
            Full
          </Button>
        ) : (
          <Link href={`/schedules/${row.original.id}`}>
            <Button className="w-full" variant="default">
              Join Class
            </Button>
          </Link>
        );
      },
    },
  ];
}
