'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataContract } from '@prisma/client';

export const dataContractTableColumns: ColumnDef<DataContract>[] = [
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
