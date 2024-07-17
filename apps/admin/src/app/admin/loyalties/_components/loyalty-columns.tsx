'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { SelectAllLoyalty, SelectAllUserName } from '@repo/shared/repository';
import { Badge } from '@repo/ui/components/ui/badge';

interface getColumnsProps {
  users: SelectAllUserName;
}

export function getColumns({
  users,
}: getColumnsProps): ColumnDef<SelectAllLoyalty['data'][0]>[] {
  return [
    {
      accessorKey: 'user_name',
      header: ({ column }) => (
        <DataTableColumnHeader className="w-40" column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.user_name}</div>,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.amount}</span>;
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader
          className=" justify-center"
          column={column}
          title="Type"
        />
      ),

      cell: ({ row }) => {
        return (
          <div className="-ml-4 flex  w-full place-content-center">
            <Badge className="w-fit text-center capitalize">
              {row.original.type}
            </Badge>
          </div>
        );
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
    // {
    //   id: 'actions',
    //   cell: function Cell({ row }) {
    //     const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
    //       React.useState(false);
    //     const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
    //       React.useState(false);

    //     return (
    //       <>
    //         <EditLoyaltyForm
    //           users={users}
    //           loyalty={row.original}
    //           open={showUpdateTaskSheet}
    //           onOpenChange={setShowUpdateTaskSheet}
    //         />
    //         <DeleteLoyaltyForm
    //           users={users}
    //           loyalty={row.original}
    //           open={showDeleteTaskDialog}
    //           onOpenChange={setShowDeleteTaskDialog}
    //         />
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button
    //               aria-label="Open menu"
    //               variant="ghost"
    //               className="flex size-8 p-0 data-[state=open]:bg-muted"
    //             >
    //               <DotsHorizontalIcon className="size-4" aria-hidden="true" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end" className="w-40">
    //             <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
    //               Edit
    //             </DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem
    //               onSelect={() => setShowDeleteTaskDialog(true)}
    //             >
    //               Delete
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </>
    //     );
    //   },
    // },
  ];
}
