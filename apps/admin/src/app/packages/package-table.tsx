'use client';

import * as React from 'react';
import type { DataTableFilterField } from '@repo/ui/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@repo/ui/components/data-table/table';
import { DataTableToolbar } from '@repo/ui/components/data-table/toolbar';

// import type { getTasks } from '../_lib/queries';
// import { getPriorityIcon, getStatusIcon } from '../_lib/utils';
import { getColumns } from './columns';
// import { TasksTableFloatingBar } from './tasks-table-floating-bar';
import { TasksTableToolbarActions } from './toolbar-actions';
import { SelectPackage } from '@repo/shared/repository';

// interface PackageTableProps {
//   packagePromise: ReturnType<typeof getPackage>;
// }

const mockPackages: SelectPackage[] = [
  {
    id: 1,
    name: 'Basic',
    price: 50000,
    credit: 10,
    loyalty_points: 10,
    valid_for: 30,
    class_type_id: 1,
    one_time_only: 0,
    created_at: new Date(),
    updated_at: new Date(),
    updated_by: 1,
  },
  {
    id: 2,
    name: 'Premium',
    price: 100000,
    credit: 20,
    loyalty_points: 20,
    valid_for: 60,
    class_type_id: 1,
    one_time_only: 0,
    created_at: new Date(),
    updated_at: new Date(),
    updated_by: 1,
  },
  {
    id: 3,
    name: 'Gold',
    price: 150000,
    credit: 30,
    loyalty_points: 30,
    valid_for: 90,
    class_type_id: 1,
    one_time_only: 0,
    created_at: new Date(),
    updated_at: new Date(),
    updated_by: 1,
  },
];

const fakePromise = () => {
  return {
    data: mockPackages,
    pageCount: 1,
  };
};

export default function PackageTable() {
  // Feature flags for showcasing some additional features. Feel free to remove them.

  const { data, pageCount } = fakePromise();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<SelectPackage>[] = [
    {
      label: 'Title',
      value: 'name',
      placeholder: 'Filter titles...',
    },
    // {
    //   label: 'Status',
    //   value: 'status',
    //   options: tasks.status.enumValues.map((status) => ({
    //     label: status[0]?.toUpperCase() + status.slice(1),
    //     value: status,
    //     icon: getStatusIcon(status),
    //     withCount: true,
    //   })),
    // },
    // {
    //   label: 'Priority',
    //   value: 'priority',
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    // optional props
    filterFields,
    // enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    defaultPerPage: 10,
    defaultSort: 'created_at.desc',
  });

  return (
    <DataTable
      table={table}
      // floatingBar={
      //   featureFlags.includes('floatingBar') ? (
      //     <TasksTableFloatingBar table={table} />
      //   ) : null
      // }
    >
      {/* {featureFlags.includes('advancedFilter') ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <TasksTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : ( */}
      <DataTableToolbar table={table} filterFields={filterFields}>
        <TasksTableToolbarActions table={table} />
      </DataTableToolbar>
      {/* )} */}
    </DataTable>
  );
}
