'use client';

import * as React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { moneyFormatter } from '@repo/shared/util';
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectClassType,
  SelectFrequentlyAskedQuestion,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import EditFrequentlyAskedQuestionForm from '../edit-faq.form';
import DeleteFrequentlyAskedQuestionDialog from '../delete-faq.dialog';

interface getColumnsProps {}

export function getColumns({}: getColumnsProps): ColumnDef<SelectFrequentlyAskedQuestion>[] {
  return [
    {
      accessorKey: 'question',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Question" />
      ),
      cell: ({ row }) => <div>{row.original.question}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'answer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Answer" />
      ),
      cell: ({ row }) => <div>{row.original.answer}</div>,
      enableSorting: false,
      enableHiding: false,
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
            <EditFrequentlyAskedQuestionForm
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              data={row.original}
            />
            <DeleteFrequentlyAskedQuestionDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              data={row.original}
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
