'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataContract } from '@prisma/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
// import { deleteMarketDataSourceAndDataFiles } from '@/lib/actions';

export const dataContractTableColumns: ColumnDef<DataContract>[] = [
  {
    accessorKey: 'latestStatusType',
    header: 'Status',
    cell: (info) => info.getValue() || 'No Status', // Fallback in case there's no status
  },
  {
    accessorKey: 'dataCustomerId',
    header: 'Data Contract Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const dataFile = row.original;

      // function handleDelete() {
      //   deleteMarketDataSourceAndDataFiles(dataFile.id);
      //   // Update the data table state after deletion
      // }

      return (
        <div className="flex space-x-2">
          {/* <Button variant="outline" size="sm" onClick={() => {}}>
            Download
          </Button> */}
          {/* <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button> */}
        </div>
      );
    },
  },
];
