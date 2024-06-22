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
import { SelectAllAgendaByUser } from '@repo/shared/repository';
import { Badge } from '@repo/ui/components/ui/badge';

export function getColumns(): ColumnDef<SelectAllAgendaByUser['data'][0]>[] {
  return [
    {
      accessorKey: 'agenda_booking_updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Tanggal Booking"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex place-content-center sm:-ml-5">
            <span className="inline-block font-semibold sm:hidden">
              Tanggal Book:&ensp;
            </span>
            <p className="font-semibold">
              {dateFormatter({
                year: undefined,
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(row.original.agenda_booking_updated_at)}
            </p>
          </div>
        );
      },
    },
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
        <div className="capitalize">
          <span className="inline-block font-semibold sm:hidden">
            Tipe :&ensp;
          </span>
          {row.original.class_type_name}
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
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-32 justify-center"
          column={column}
          title="Slot"
        />
      ),

      cell: ({ row }) => {
        return (
          <div className="sm:-ml-5 sm:text-center">
            <span className="inline-block font-semibold sm:hidden">
              Status :&ensp;
            </span>
            <Badge className="text-center capitalize">
              {row.original.agenda_booking_status.split('_').join(' ')}
            </Badge>
          </div>
        );
      },
    },
  ];
}
