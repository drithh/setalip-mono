'use client';

import {
  SelectAllSchedule,
} from '@repo/shared/repository';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';


import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';

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
  ];
}
