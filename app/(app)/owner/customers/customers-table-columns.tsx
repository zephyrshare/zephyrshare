'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteDataCustomer } from '@/lib/actions';

export const customersTableColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Organization Name',
    cell: ({ row }) => {
      const customer = row.original;
      return <div>{customer.name}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original;

      function handleDelete() {
        deleteDataCustomer(customer.id);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Add Member</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            >
              <div className="text-red">Delete Customer</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
