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
import { SelectCarousel } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditCarouselForm from '../edit-carousel.form';
import DeleteCarouselDialog from '../delete-carousel.dialog';

interface getColumnsProps {}

export function getColumns({}: getColumnsProps): ColumnDef<SelectCarousel>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => <div>{row.original.title}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'image_url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image URL" />
      ),
      cell: ({ row }) => <div>{row.original.image_url}</div>,
      enableSorting: false,
      enableHiding: false,
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
            <EditCarouselForm
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              data={row.original}
            />
            <DeleteCarouselDialog
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
