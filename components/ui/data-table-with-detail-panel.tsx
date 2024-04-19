'use client';

import { useState } from 'react';
import DataTable, { DataTableProps } from '@/components/ui/data-table';

export default function DataTableWithDetailPanel<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [panelIsOpen, setPanelIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const handleRowClick = (item: TData) => {
    setSelectedItem(item);
    setPanelIsOpen(true);
  };

  return (
    <div className="flex w-full">
      {/* DataTable with conditional width based on panel state */}
      <div className={`w-full ${panelIsOpen ? 'lg:w-1/2' : ''}`}>
        <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>

      {/* Details Panel */}
      {panelIsOpen && (
        <div className="w-full lg:w-1/2 h-full">
          <div className="flex flex-col h-full bg-white">
            <div className="flex justify-end p-4">
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setPanelIsOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 overflow-y-auto">
              <div className="flex-1 p-4">
                {/* Dynamic content based on selected item */}
                <h2 className="text-lg font-medium dark:text-white">Details</h2>
                {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                  <p key={key} className="text-gray-500 dark:text-gray-400">{`${key}: ${value}`}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
