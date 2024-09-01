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
import { Badge } from '@repo/ui/components/ui/badge';

interface getColumnsProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
  isRecurrence: boolean;
}

export function getColumns({
  locations,
  coaches,
  classes,
  isRecurrence,
}: getColumnsProps): ColumnDef<SelectAgendaWithCoachAndClass>[] {
  // generate random color in total of classes
  // Function to generate a random color in hexadecimal format
  const generateColorFromName = (name: string) => {
    // Simple hash function to convert string to a number
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
      }
      return hash;
    };

    // Convert hash code to a bright color code
    const hash = hashCode(name);
    const red = (hash & 0xff0000) >> 16;
    const green = (hash & 0x00ff00) >> 8;
    const blue = hash & 0x0000ff;

    // Ensure the color is bright by adjusting the color components
    const brighten = (color: number) => Math.min(255, color + 64); // Add 128 to make sure it's bright

    const brightRed = brighten(red);
    const brightGreen = brighten(green);
    const brightBlue = brighten(blue);

    const color = `#${brightRed.toString(16).padStart(2, '0')}${brightGreen.toString(16).padStart(2, '0')}${brightBlue.toString(16).padStart(2, '0')}`;

    return color;
  };
  // Generate random colors for the total number of classes
  const colors = classes.map(({ name }) => {
    return {
      name,
      color: generateColorFromName(name),
    };
  });
  return [
    {
      accessorKey: 'class_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kelas" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex place-items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: colors.find(
                  (color) => color.name === row.original.class_name,
                )?.color,
              }}
            ></div>
            <span>{row.original.class_name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'time',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => {
        return isRecurrence ? (
          <p className="">
            Setiap {format(row.original.time, 'EEEE - hh:mm')} (
            {row.original.class_duration} menit)
          </p>
        ) : (
          <p className="">
            {`${format(new Date(row.original.time), 'MMM dd - HH:mm')} (${row.original.class_duration} menit)`}
          </p>
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
      accessorKey: 'class_type_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipe Kelas" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          <span className="inline-block font-semibold sm:hidden">
            Tipe :&ensp;
          </span>
          <Badge>{row.original.class_type_name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'is_show',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Publik" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          <span className="inline-block font-semibold sm:hidden">
            Publik :&ensp;
          </span>
          <Badge>{row.original.is_show === 1 ? 'Ya' : 'Tidak'}</Badge>
        </div>
      ),
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
