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
import { moneyFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectAllUserName,
  SelectVoucherWithUser,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditVoucherForm from '../edit-voucher.form';
import DeleteVoucherDialog from '../delete-voucher.dialog';
import { Badge } from '@repo/ui/components/ui/badge';
import { format } from 'date-fns';

interface getColumnsProps {
  users: SelectAllUserName;
}

export function getColumns({
  users,
}: getColumnsProps): ColumnDef<SelectVoucherWithUser>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name ?? 'Semua'}</div>,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
      cell: ({ row }) => <div>{row.original.code}</div>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Type"
        />
      ),
      cell: ({ row }) => (
        <div className="-ml-5 text-center">
          <Badge>{row.original.type}</Badge>,
        </div>
      ),
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Discount"
        />
      ),
      cell: ({ row }) => (
        <div className="-ml-5 text-center">
          {row.original.type === 'percentage'
            ? `${row.original.discount}%`
            : moneyFormatter.format(row.original.discount)}
        </div>
      ),
    },
    {
      accessorKey: 'expired_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expired At" />
      ),
      cell: ({ row }) => (
        <div>{format(row.original.expired_at, 'dd/MM/yyyy')}</div>
      ),
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
            <EditVoucherForm
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              users={users}
              data={row.original}
            />
            <DeleteVoucherDialog
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
