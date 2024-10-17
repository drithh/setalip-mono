'use client';

import { moneyFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { Badge } from '@repo/ui/components/ui/badge';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';
import EditPackageTransactionForm from '../edit-package-transaction.form';
import { SelectPackageTransaction__Package__UserPackage } from '@repo/shared/service';

export function getColumns(): ColumnDef<SelectPackageTransaction__Package__UserPackage>[] {
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
            ) : row.original.status === 'pending' ? (
              <EditPackageTransactionForm data={row.original} />
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
  ];
}
