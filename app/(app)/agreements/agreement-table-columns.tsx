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
import { deleteAgreement } from '@/lib/actions/actions';
import { Agreement } from '@prisma/client';

export const agreementTableColumns: ColumnDef<Agreement>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const agreement = row.original;
      return (
        <Link href={`agreements/${agreement.id}`}>
          <div>{agreement.name}</div>
        </Link>
      );
    },
  },
  // {
  //   accessorKey: 'description',
  //   header: 'Description',
  // },
  // {
  //   accessorKey: 'file',
  //   header: 'File',
  // },
  {
    accessorKey: 'contentType',
    header: 'File Type',
  },
  // {
  //   accessorKey: 'startDate',
  //   header: 'Start Date',
  // },
  // {
  //   accessorKey: 'endDate',
  //   header: 'End Date',
  // },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const agreement = row.original;

      function handleDelete() {
        deleteAgreement(agreement.id);
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
              <Link href={`agreements/${agreement.id}`}>View Agreement</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Agreement</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            >
              <div className="text-red">Delete Agreement</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
