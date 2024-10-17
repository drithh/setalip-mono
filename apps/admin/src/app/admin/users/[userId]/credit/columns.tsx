'use client';

import {
  SelectCreditPagination,
  SelectClassType,
  SelectCredit,
} from '@repo/shared/repository';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { Badge } from '@repo/ui/components/ui/badge';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';

interface getColumnsProps {
  classTypes: SelectClassType[];
}

export function getColumns(data: getColumnsProps): ColumnDef<SelectCredit>[] {
  return [
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Tanggal Transaksi"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex place-content-center sm:-ml-5">
            <span className="inline-block font-semibold sm:hidden">
              Tanggal Transaksi:&ensp;
            </span>
            <p className="font-semibold">
              {format(new Date(row.original.updated_at), 'MMM dd - HH:mm')}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: 'note',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Catatan" />
      ),
      cell: ({ row }) => <div>{row.original.note}</div>,
    },
    {
      accessorKey: 'class_type_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipe Kelas" />
      ),
      cell: ({ row }) => (
        <div className="md:-ml-5 md:text-center">
          <Badge>
            {
              data.classTypes.find(
                (classType) => classType.id === row.original.class_type_id,
              )?.type
            }
          </Badge>
        </div>
      ),
    },
    // {
    //   accessorKey: 'amount',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Jumlah" />
    //   ),
    //   cell: ({ row }) => (
    //     <p className="md:-ml-5 md:text-center">
    //       <span className="inline-block font-semibold sm:hidden">
    //         Jumlah :&ensp;
    //       </span>
    //       {row.original.amount * (row.original.type === 'credit' ? -1 : 1)}
    //     </p>
    //   ),
    // },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-32 justify-center"
          column={column}
          title="Type"
        />
      ),

      // cell: ({ row }) => {
      //   return (
      //     <div className="sm:-ml-5 sm:text-center">
      //       <span className="inline-block font-semibold sm:hidden">
      //         Type :&ensp;
      //       </span>
      //       <Badge className="text-center capitalize">
      //         {row.original.type}
      //       </Badge>
      //     </div>
      //   );
      // },
    },
  ];
}
