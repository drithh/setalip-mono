'use client';

import * as React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

// import { getErrorMessage } from '@/lib/handle-error';
// import { formatDate } from '@/lib/utils';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import { SelectClassType, SelectPackage } from '@repo/shared/repository';

// import { updateTask } from '../_lib/actions';
// import { getPriorityIcon, getStatusIcon } from '../_lib/utils';
// import { DeleteTasksDialog } from './delete-tasks-dialog';
// import { UpdateTaskSheet } from './update-task-sheet';

const convertToRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

interface getColumnsProps {
  classTypes: SelectClassType[];
}

export function getColumns({
  classTypes,
}: getColumnsProps): ColumnDef<SelectPackage>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
        return <span>{convertToRupiah(row.original.price)}</span>;
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
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        return (
          <span>actions</span>
          // <>
          //   <UpdateTaskSheet
          //     open={showUpdateTaskSheet}
          //     onOpenChange={setShowUpdateTaskSheet}
          //     task={row.original}
          //   />
          //   <DeleteTasksDialog
          //     open={showDeleteTaskDialog}
          //     onOpenChange={setShowDeleteTaskDialog}
          //     tasks={[row.original]}
          //     showTrigger={false}
          //     onSuccess={() => row.toggleSelected(false)}
          //   />
          //   <DropdownMenu>
          //     <DropdownMenuTrigger asChild>
          //       <Button
          //         aria-label="Open menu"
          //         variant="ghost"
          //         className="flex size-8 p-0 data-[state=open]:bg-muted"
          //       >
          //         <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          //       </Button>
          //     </DropdownMenuTrigger>
          //     <DropdownMenuContent align="end" className="w-40">
          //       <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
          //         Edit
          //       </DropdownMenuItem>
          //       <DropdownMenuSub>
          //         <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          //         <DropdownMenuSubContent>
          //           <DropdownMenuRadioGroup
          //             value={row.original.label}
          //             onValueChange={(value) => {
          //               startUpdateTransition(() => {
          //                 toast.promise(
          //                   updateTask({
          //                     id: row.original.id,
          //                     label: value as Task['label'],
          //                   }),
          //                   {
          //                     loading: 'Updating...',
          //                     success: 'Label updated',
          //                     error: (err) => getErrorMessage(err),
          //                   },
          //                 );
          //               });
          //             }}
          //           >
          //             {tasks.label.enumValues.map((label) => (
          //               <DropdownMenuRadioItem
          //                 key={label}
          //                 value={label}
          //                 className="capitalize"
          //                 disabled={isUpdatePending}
          //               >
          //                 {label}
          //               </DropdownMenuRadioItem>
          //             ))}
          //           </DropdownMenuRadioGroup>
          //         </DropdownMenuSubContent>
          //       </DropdownMenuSub>
          //       <DropdownMenuSeparator />
          //       <DropdownMenuItem
          //         onSelect={() => setShowDeleteTaskDialog(true)}
          //       >
          //         Delete
          //         <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          //       </DropdownMenuItem>
          //     </DropdownMenuContent>
          //   </DropdownMenu>
          // </>
        );
      },
    },
  ];
}
