'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MarketDataSource } from '@prisma/client';
import { deleteMarketDataSourceAndDataFiles } from '@/lib/actions';

export const marketDataSourceTableColumns: ColumnDef<MarketDataSource>[] = [
  {
    accessorKey: 'name',
    header: 'Market Data',
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
