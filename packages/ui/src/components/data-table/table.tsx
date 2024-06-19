import * as React from 'react';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { cn } from '#dep/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#dep/components/ui/table';
import { DataTablePagination } from '#dep/components/data-table/pagination';

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null;
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      {children}
      <div className="rounded-md border">
        <Table className="hidden sm:table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="p-4 sm:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} className="mb-4 border rounded p-4">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="mb-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="h-24 text-center">No results.</div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  );
}
