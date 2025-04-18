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
import { DataTableColumnHeader } from '@repo/ui/components/data-table/column-header';
import {
  SelectAllUserName,
  SelectClassType,
  SelectLocation,
  SelectUserWithCredits,
} from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
// import DeletePackageDialog from './delete-package.dialog';
import EditUserForm from '../edit-user.form';
import CreateCreditForm from '../create-credit.form';
import DeleteCreditForm from '../delete-credit.form';
import { format } from 'date-fns';
import CreateLoyaltyForm from '../create-loyalty.form';
import DeleteLoyaltyForm from '../delete-loyalty.form';
import Link from 'next/link';

interface getColumnsProps {
  locations: SelectLocation[];
  classTypes: SelectClassType[];
  users: SelectAllUserName;
}

export function getColumns({
  locations,
  classTypes,
  users,
}: getColumnsProps): ColumnDef<SelectUserWithCredits>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader className="w-40" column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'phone_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        return <span className="capitalize">{row.original.role}</span>;
      },
    },
    {
      accessorKey: 'location_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {
              locations.find(
                (location) => location.id === row.original.location_id,
              )?.name
            }
          </span>
        );
      },
    },
    {
      accessorKey: 'verified_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class Type" />
      ),
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {row.original.verified_at
              ? format(
                  new Date(row.original.verified_at),
                  'MMM dd, yyyy - HH:mm',
                )
              : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.updated_at
              ? format(new Date(row.original.updated_at), 'MMM dd, yyyy')
              : '-'}
          </span>
        );
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
        // const [showEditUserSheet, setShowEditUserSheet] = React.useState(false);
        // const [showCreateCreditSheet, setShowCreateCreditSheet] =
        //   React.useState(false);
        // const [showDeleteCreditSheet, setShowDeleteCreditSheet] =
        //   React.useState(false);
        // const [showCreateLoyaltySheet, setShowCreateLoyaltySheet] =
        //   React.useState(false);
        // const [showDeleteLoyaltySheet, setShowDeleteLoyaltySheet] =
        //   React.useState(false);

        return (
          <Button>
            <Link href={`/admin/users/${row.original.id}`}>
              Manage
              {/* <EditUserForm
              locations={locations}
              open={showEditUserSheet}
              onOpenChange={setShowEditUserSheet}
              user={row.original}
            />
            <CreateCreditForm
              open={showCreateCreditSheet}
              onOpenChange={setShowCreateCreditSheet}
              user={row.original}
              classTypes={classTypes}
            />
            <DeleteCreditForm
              open={showDeleteCreditSheet}
              onOpenChange={setShowDeleteCreditSheet}
              user={row.original}
              classTypes={classTypes}
            />
            <CreateLoyaltyForm
              open={showCreateLoyaltySheet}
              onOpenChange={setShowCreateLoyaltySheet}
              users={users}
            />
            <DeleteLoyaltyForm
              open={showDeleteLoyaltySheet}
              onOpenChange={setShowDeleteLoyaltySheet}
              users={users}
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
                <DropdownMenuItem onSelect={() => setShowEditUserSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowCreateCreditSheet(true)}
                >
                  Add Credit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteCreditSheet(true)}
                >
                  Reduce Credit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowCreateLoyaltySheet(true)}
                >
                  Add Loyalty
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteLoyaltySheet(true)}
                >
                  Reduce Loyalty
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            </Link>
          </Button>
        );
      },
    },
  ];
}
