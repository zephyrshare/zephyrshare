'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MarketDataSource } from '@prisma/client';

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
      return <div className="flex space-x-2"></div>;
    },
  },
];
