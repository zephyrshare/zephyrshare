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

  // When the user clicks a row of the DataTable, the details panel opens up on the right half of the screen and shows details about the row
  return (
    <>
      <DataTable columns={columns} data={data} onRowClick={handleRowClick} />

      {/* Details Panel */}
      {panelIsOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 z-50">
          <div className="flex flex-col h-full">
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
                {/* Details Panel Content */}
                <div className="flex-1 p-4">
                  <h2 className="text-lg font-medium dark:text-white">Details</h2>
                  {selectedItem &&
                    Object.entries(selectedItem).map(([key, value]) => (
                      <p key={key} className="text-gray-500 dark:text-gray-400">{`${key}: ${value}`}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
