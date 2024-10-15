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
  SelectClass,
  SelectCoachWithUser,
  SelectLocation,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditForm from './edit.form';
import DeleteDialog from './delete.dialog';
import { Badge } from '@repo/ui/components/ui/badge';
import { format } from 'date-fns';
import { SelectAgendaRecurrence__Coach__Class__Location } from '@repo/shared/service';

interface getColumnsProps {
  locations: SelectLocation[];
  coaches: SelectCoachWithUser[];
  classes: SelectClass[];
}

export function getColumns({
  locations,
  coaches,
  classes,
}: getColumnsProps): ColumnDef<SelectAgendaRecurrence__Coach__Class__Location>[] {
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
      accessorKey: 'start_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ row }) => (
        <div>{format(row.original.start_date, 'yyyy-MM-dd')}</div>
      ),
    },
    {
      accessorKey: 'end_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" />
      ),
      cell: ({ row }) => (
        <div>{format(row.original.end_date, 'yyyy-MM-dd')}</div>
      ),
    },
    {
      accessorKey: 'time',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => {
        return (
          <p className="">
            {`${row.original.time} (${row.original.class_duration} menit)`}
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
        return <p className="-ml-5 text-center">{row.original.class_slot}</p>;
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
      accessorKey: 'day_of_week',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hari" />
      ),
      cell: ({ row }) => {
        return <p className="">{row.original.day_of_week}</p>;
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        return (
          <>
            {showUpdateTaskSheet && (
              <EditForm
                locations={locations}
                coaches={coaches}
                classes={classes}
                open={showUpdateTaskSheet}
                onOpenChange={setShowUpdateTaskSheet}
                data={row.original}
              />
            )}
            {showDeleteTaskDialog && (
              <DeleteDialog
                open={showDeleteTaskDialog}
                onOpenChange={setShowDeleteTaskDialog}
                data={row.original}
              />
            )}
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
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
