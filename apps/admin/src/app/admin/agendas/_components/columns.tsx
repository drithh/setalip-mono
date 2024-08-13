'use client';

import * as React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectAgendaWithCoachAndClass,
  SelectClass,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditParticipantForm from '../edit-participant.form';
import EditAgendaForm from '../edit-agenda.form';
import { format } from 'date-fns';
import DeleteAgendaDialog from '../delete-agenda.dialog';

interface getColumnsProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
}

export function getColumns({
  locations,
  coaches,
  classes,
}: getColumnsProps): ColumnDef<SelectAgendaWithCoachAndClass>[] {
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-0.5"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-0.5"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'class_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kelas" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.class_name}</span>;
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
      cell: ({ row }) => <div>{row.original.location_name}</div>,
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
      accessorKey: 'time',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => {
        return (
          <p className="">
            {`${format(new Date(row.original.time), 'MMM dd - HH:mm')} (${row.original.class_duration} menit)`}
          </p>
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
          <p className="-ml-5 text-center">
            {row.original.participants?.length ?? 0} / {row.original.slot}
          </p>
        );
      },
    },

    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.updated_at.toDateString()}</span>;
      },
    },
    {
      accessorKey: 'updated_by',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated By" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.updated_by}</span>;
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showEditAgendaSheet, setShowEditAgendaSheet] =
          React.useState(false);
        const [showEditParticipantSheet, setShowEditParticipantSheet] =
          React.useState(false);
        const [showDeleteAgendaDialog, setShowDeleteAgendaDialog] =
          React.useState(false);

        return (
          <>
            {showEditAgendaSheet && (
              <EditAgendaForm
                open={showEditAgendaSheet}
                onOpenChange={setShowEditAgendaSheet}
                agenda={row.original}
                classes={classes}
                locations={locations}
                coaches={coaches}
              />
            )}
            {showEditParticipantSheet && (
              <EditParticipantForm
                open={showEditParticipantSheet}
                onOpenChange={setShowEditParticipantSheet}
                participants={row.original.participants ?? []}
                agendaId={row.original.id}
              />
            )}
            <DeleteAgendaDialog
              open={showDeleteAgendaDialog}
              onOpenChange={setShowDeleteAgendaDialog}
              data={row.original}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon
                    // onClick={() => }
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => {
                    console.log(row.original);
                    setShowEditAgendaSheet(true);
                  }}
                >
                  Edit Agenda
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowEditParticipantSheet(true)}
                >
                  Manage Participants
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteAgendaDialog(true)}
                >
                  Delete Agenda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
