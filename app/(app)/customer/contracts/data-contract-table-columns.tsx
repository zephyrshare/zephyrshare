'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataContract } from '@prisma/client';

export const dataContractTableColumns: ColumnDef<DataContract>[] = [
  {
    accessorKey: 'latestStatus.statusDescription', // Access nested property
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
      return <div className="flex space-x-2"></div>;
    },
  },
];
