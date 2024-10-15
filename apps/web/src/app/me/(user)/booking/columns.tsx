'use client';

import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { Badge } from '@repo/ui/components/ui/badge';

import { type ColumnDef } from '@tanstack/react-table';
import { differenceInHours, format, isBefore } from 'date-fns';
import * as React from 'react';
import DeleteAgendaDialog from './cancel-booking.dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@repo/ui/components/ui/dropdown-menu';
import { SelectAgenda__Coach__Class__Location__AgendaBooking } from '@repo/shared/service';

export function getColumns(): ColumnDef<SelectAgenda__Coach__Class__Location__AgendaBooking>[] {
  return [
    {
      accessorKey: 'time',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-32 justify-center"
          column={column}
          title="Waktu"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="-ml-2 flex flex-col place-items-center">
            <p className="font-semibold">
              {format(
                new Date(row.original.time ?? new Date()),
                'MMM dd - HH:mm',
              )}
            </p>
            <p>({row.original.class_duration} menit)</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'agenda_booking_updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Tanggal Book"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex place-content-center sm:-ml-5">
            <span className="inline-block font-semibold sm:hidden">
              Tanggal Book:&ensp;
            </span>
            <p className="font-semibold">
              {format(
                new Date(row.original.agenda_booking_updated_at),
                'MMM dd - HH:mm',
              )}
            </p>
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
          title="Status"
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

    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);
        const agendaTime = row.original.time ?? new Date();
        const now = new Date();

        const hoursDifference = differenceInHours(agendaTime, now);
        const isWithin24Hours =
          hoursDifference < 24 && isBefore(now, agendaTime);
        return (
          <>
            <DeleteAgendaDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              data={row.original}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {/* <DropdownMenuSeparator /> */}
                {!isWithin24Hours && (
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteTaskDialog(true)}
                  >
                    Cancel booking
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
