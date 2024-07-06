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
import { moneyFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectClassType,
  SelectPackageTransaction,
  SelectPackageTransactionWithUser,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditPackageTransactionForm from '../edit-package-transactions.form';
//
interface getColumnsProps {
  statuses: SelectPackageTransaction['status'][];
  // classTypes: SelectClassType[];
}

export function getColumns({
  statuses,
}: getColumnsProps): ColumnDef<SelectPackageTransactionWithUser>[] {
  return [
    {
      accessorKey: 'packageTransaction_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Validity" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.package_name} days</span>;
      },
    },
    {
      accessorKey: 'user_name',
      header: ({ column }) => (
        <DataTableColumnHeader className="w-40" column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.user_name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'amount_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount Paid" />
      ),
      cell: ({ row }) => {
        return <span>{moneyFormatter.format(row.original.amount_paid)}</span>;
      },
    },
    {
      accessorKey: 'unique_code',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Unique Code"
        />
      ),

      cell: ({ row }) => {
        return <p className="-ml-5 text-center">{row.original.unique_code}</p>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => {
        return <p className="-ml-5 text-center">{row.original.status}</p>;
      },
    },
    {
      accessorKey: 'deposit_account_bank',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deposit Account" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.deposit_account_bank}</span>;
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
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        // const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
        //   React.useState(false);

        return (
          <>
            <EditPackageTransactionForm
              statuses={statuses}
              // classTypes={classTypes}
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              singlePackageTransaction={row.original}
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
