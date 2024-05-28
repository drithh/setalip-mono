'use client';

import { DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

// import { exportTableToCSV } from '@/lib/export';
import { Button } from '@repo/ui/components/ui/button';

// import { CreateTaskDialog } from './create-task-dialog';
// import { DeleteTasksDialog } from './delete-tasks-dialog';
import { SelectPackage } from '@repo/shared/repository';

interface TasksTableToolbarActionsProps {
  table: Table<SelectPackage>;
}

export function TasksTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        // <DeleteTasksDialog
        //   tasks={table
        //     .getFilteredSelectedRowModel()
        //     .rows.map((row) => row.original)}
        //   onSuccess={() => table.toggleAllRowsSelected(false)}
        // />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.toggleAllRowsSelected(false);
            // toast('Tasks deleted successfully');
          }}
        >
          <TrashIcon className="mr-2 size-4" aria-hidden="true" />
          Delete
        </Button>
      ) : null}
      <Button
        variant="default"
        size="sm"
        // onClick={() => table.toggleAllRowsSelected(false)}
      >
        Create Task
      </Button>
      {/* <CreateTaskDialog prevTasks={table.getFilteredRowModel().rows} /> */}
      <Button
        variant="outline"
        size="sm"
        // onClick={() =>
        // exportTableToCSV(table, {
        //   filename: 'tasks',
        //   excludeColumns: ['select', 'actions'],
        // })
        // }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
