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
import { SelectDepositAccount } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditDepositAccountForm from '../edit-deposit-account.form';
import DeleteDepositAccountDialog from '../delete-deposit-account.dialog';

interface getColumnsProps {}

export function getColumns({}: getColumnsProps): ColumnDef<SelectDepositAccount>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'bank_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bank Name" />
      ),
      cell: ({ row }) => <div>{row.original.bank_name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'account_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomor Rekening" />
      ),
      cell: ({ row }) => <div>{row.original.account_number}</div>,
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
            <EditDepositAccountForm
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              data={row.original}
            />
            <DeleteDepositAccountDialog
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
