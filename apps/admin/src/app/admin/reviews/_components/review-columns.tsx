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
  SelectAllUserName,
  SelectReviewWithUser,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditReviewForm from '../edit-review.form';
import DeleteReviewDialog from '../delete-review.dialog';

interface getColumnsProps {
  users: SelectAllUserName;
}

export function getColumns({
  users,
}: getColumnsProps): ColumnDef<SelectReviewWithUser>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.original.email}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'review',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Review" />
      ),
      cell: ({ row }) => <div>{row.original.review}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => <div>{row.original.rating}</div>,
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
            <EditReviewForm
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              users={users}
              data={row.original}
            />
            <DeleteReviewDialog
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
