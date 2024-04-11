'use client';
import DataTable, { DataTableProps } from '@/components/ui/data-table';

export default function DataTableWithDetailPanel<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
