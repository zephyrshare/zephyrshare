'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataFile } from '@prisma/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { deleteDataFile } from '@/lib/actions';

export const dataFileTableColumns: ColumnDef<DataFile>[] = [
  {
    accessorKey: 'name',
    header: 'File Name',
  },
  {
    accessorKey: 'uploaderId',
    header: 'Uploaded By',
    cell: ({ row }) => {
      const dataFile = row.original;
      // Replace this with logic to fetch and display the uploader's name based on uploaderId
      return <div>Uploader Name</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Uploaded',
    cell: ({ row }) => {
      const dataFile = row.original;
      return <div>{format(dataFile.createdAt, 'yyyy-MM-dd HH:mm')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const dataFile = row.original;

      function handleDelete() {
        deleteDataFile(dataFile.id);
        // Update the data table state after deletion
      }

      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            Download
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
