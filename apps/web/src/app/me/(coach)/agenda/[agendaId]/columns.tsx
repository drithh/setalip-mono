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
import {
  SelectAgendaWithCoachAndClass,
  SelectAllAgendaByUser,
  SelectAllSchedule,
  SelectBookingParticipant,
  SelectParticipant,
} from '@repo/shared/repository';
import { Badge } from '@repo/ui/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@repo/ui/components/ui/button';
import { AgendaBookings } from '@repo/shared/db';
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
