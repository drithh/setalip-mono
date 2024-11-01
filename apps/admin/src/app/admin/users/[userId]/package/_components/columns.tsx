'use client';

import { moneyFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { Badge } from '@repo/ui/components/ui/badge';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';
import EditPackageTransactionForm from '../edit-package-transaction.form';
import { SelectPackageTransaction__Package__UserPackage } from '@repo/shared/service';
import EditUserPackageForm from '../edit-user-package.form';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/ui/components/ui/dropdown-menu';
import DeleteDialog from '../delete.dialog';

interface getColumnsProps {
  isPending: boolean;
}

export function getColumns(
  props: getColumnsProps,
): ColumnDef<SelectPackageTransaction__Package__UserPackage>[] {
  return [
    {
      accessorKey: 'package_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Package" />
      ),
      cell: ({ row }) => <div>{row.original?.package_name}</div>,
    },
    {
      accessorKey: 'amount_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harga Beli" />
      ),
      cell: ({ row }) => (
        <p className="">
          <span className="inline-block font-semibold sm:hidden">
            Harga Beli:&ensp;
          </span>
          {moneyFormatter.format(row.original.amount_paid)}
        </p>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Status Transaksi"
        />
      ),

      cell: ({ row }) => {
        return (
          <div className="sm:-ml-5 sm:text-center">
            <span className="inline-block font-semibold sm:hidden">
              Type :&ensp;
            </span>
            <Badge className="text-center capitalize">
              {row.original.status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'package_expired_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          className=""
          column={column}
          title="Tanggal Expired"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex ">
            <span className="inline-block font-semibold sm:hidden">
              Tanggal Expired:&ensp;
            </span>
            {row.original.user_package_expired_at ? (
              <p className="font-semibold">
                {format(
                  new Date(row.original.user_package_expired_at),
                  'MMM dd - HH:mm',
                )}
              </p>
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showEditUserPackage, setShowEditUserPackage] =
          React.useState(false);
        // const [showEditPackageTransaction, setShowEditPackageTransaction] =
        //   React.useState(false);
        const [showDeleteUserPackage, setShowDeleteUserPackage] =
          React.useState(false);
        return (
          <>
            {/* {showEditPackageTransaction && (
              <EditPackageTransactionForm
                data={row.original}
                open={showEditPackageTransaction}
                onOpenChange={setShowEditPackageTransaction}
              />
            )} */}
            {showDeleteUserPackage && (
              <DeleteDialog
                data={row.original}
                open={showDeleteUserPackage}
                onOpenChange={setShowDeleteUserPackage}
              />
            )}
            {showEditUserPackage && (
              <EditUserPackageForm
                data={row.original}
                open={showEditUserPackage}
                onOpenChange={setShowEditUserPackage}
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
                {/* <DropdownMenuItem
                  onSelect={() => {
                    setShowEditPackageTransaction(true);
                  }}
                >
                  Edit Transaction
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onSelect={() => {
                    setShowDeleteUserPackage(true);
                  }}
                >
                  Cancle User Package
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowEditUserPackage(true)}>
                  Edit User Package
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
