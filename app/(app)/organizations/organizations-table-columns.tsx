'use client';

import Link from 'next/link';
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
import { deleteOrganization } from '@/lib/actions';
import { Organization } from '@/lib/types';

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const organization = row.original;
      return (
        <Link href={`/organizations/${organization.id}`}>
          <div>{organization.name}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const organization = row.original;

      function handleDelete() {
        deleteOrganization(organization.id);
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
            <DropdownMenuItem onClick={() => {}}>
              <Link href={`/organizations/${organization.id}`}>View Organziation</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Organziation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            >
              <div className="text-red">Delete Organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
