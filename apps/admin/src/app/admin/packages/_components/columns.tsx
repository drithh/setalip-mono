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
import { SelectClassType, SelectPackage } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditPackageForm from '../edit-package.form';
import DeletePackageDialog from '../delete-package.dialog';

interface getColumnsProps {
  classTypes: SelectClassType[];
}

export function getColumns({
  classTypes,
}: getColumnsProps): ColumnDef<SelectPackage>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader className="w-40" column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        return <span>{moneyFormatter.format(row.original.price)}</span>;
      },
    },
    {
      accessorKey: 'credit',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Credit"
        />
      ),

      cell: ({ row }) => {
        return <p className="-ml-5 text-center">{row.original.credit}</p>;
      },
    },
    {
      accessorKey: 'loyalty_points',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Loyalty Points"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="-ml-5 text-center">{row.original.loyalty_points}</p>
        );
      },
    },
    {
      accessorKey: 'valid_for',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Validity" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.valid_for} days</span>;
      },
    },
    {
      accessorKey: 'class_type_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class Type" />
      ),
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {
              classTypes.find(
                (classType) => classType.id === row.original.class_type_id,
              )?.type
            }
          </span>
        );
      },
    },
    {
      accessorKey: 'one_time_only',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="One Time Only" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.one_time_only ? 'Yes' : 'No'}</span>;
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
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        return (
          <>
            <EditPackageForm
              classTypes={classTypes}
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              singlePackage={row.original}
            />
            <DeletePackageDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              singlePackage={row.original}
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
