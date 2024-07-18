'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectAllLoyalty,
  SelectAllLoyaltyReward,
  SelectAllUserName,
} from '@repo/shared/repository';
import { Badge } from '@repo/ui/components/ui/badge';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/ui/components/ui/dropdown-menu';
import DeleteLoyaltyRewardDialog from '../delete-loyalty-reward.dialog';
import EditLoyaltyRewardForm from '../edit-loyalty-reward.form';

interface getColumnsProps {}

export function getColumns({}: getColumnsProps): ColumnDef<
  SelectAllLoyaltyReward['data'][0]
>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader className="w-40" column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: 'credit',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Point" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.credit}</span>;
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.description}</span>;
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Aktif" />
      ),
      cell: ({ row }) => {
        return <Badge>{row.original.is_active ? 'Aktif' : 'Tidak'}</Badge>;
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
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.created_at.toDateString()}</span>;
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
            <EditLoyaltyRewardForm
              data={row.original}
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
            />
            <DeleteLoyaltyRewardDialog
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
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
