'use client';

import { AgendaBookings } from '@repo/shared/db';
import {
  SelectBookingParticipant,
} from '@repo/shared/repository';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';


import { type ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import Status from './status';

export function getColumns(): ColumnDef<SelectBookingParticipant>[] {
  const statuses = [
    'booked',
    'checked_in',
    'no_show',
  ] satisfies AgendaBookings['status'][];

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => {
        return <p>{row.original.name}</p>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="ml-auto flex w-48 place-content-center"
          column={column}
          title="Attendance"
        />
      ),
      cell: ({ row }) => (
        <div className="flex w-full place-content-end md:ml-auto md:mr-6 md:w-40">
          <Status data={row.original} statuses={statuses} />
        </div>
      ),
    },
  ];
}
