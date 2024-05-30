'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SelectPackage } from '@repo/shared/repository';
import Link from 'next/link';
import { api } from '@/trpc/react';
import PackageTable from './package-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useDataTable } from '@/hooks/use-data-table';
import { getColumns } from './columns';
import { TYPES, container } from '@repo/shared/inversify';
import { ClassTypeService } from '@repo/shared/service';

// export const columns: ColumnDef<SelectPackage>[] = [
//   {
//     accessorKey: 'name',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Name" />
//     ),
//   },
//   {
//     accessorKey: 'price',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Price" />
//     ),
//     cell: ({ row }) => {
//       return <span>{convertToRupiah(row.original.price)}</span>;
//     },
//   },
//   {
//     accessorKey: 'credit',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Duration" />
//     ),
//   },
//   {
//     accessorKey: 'loyalty_points',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Loyalty Points" />
//     ),
//   },
//   {
//     accessorKey: 'valid_for',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Validity" />
//     ),
//     cell: ({ row }) => {
//       return <span>{row.original.valid_for} days</span>;
//     },
//   },
//   {
//     accessorKey: 'actions',
//     header: 'Actions',
//     cell: ({ row }) => {
//       return (
//         <div className="flex space-x-2">
//           <button className="rounded-full p-2 hover:bg-gray-200">
//             <Pencil className="h-4 w-4" />
//           </button>
//           <button className="rounded-full p-2 hover:bg-gray-200">
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       );
//     },
//   },
// ];

export default async function Packages() {
  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <PackageTable classTypes={classTypes.result ?? []} />
    </main>
  );
}
