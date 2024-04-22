'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DataTable, { DataTableProps } from '@/components/ui/data-table';

const panelOpenWidthClasses = {
  1: 'lg:w-1/12',
  2: 'lg:w-2/12',
  3: 'lg:w-3/12',
  5: 'lg:w-5/12',
  7: 'lg:w-7/12',
  9: 'lg:w-9/12',
  10: 'lg:w-10/12',
  11: 'lg:w-11/12',
};

export default function DataTableWithDetailPanel<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [panelOpenWidth, setPanelOpenWidth] = useState(0); // 0 = closed, 5 = half, 10 = full
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const handleRowClick = (item: TData) => {
    setSelectedItem(item);
    setPanelOpenWidth(5);
  };

  return (
    <div className="flex w-full">
      {/* DataTable with conditional width based on panel state */}
      <div className={`w-full ${panelOpenWidthClasses[(12 - panelOpenWidth) as keyof typeof panelOpenWidthClasses]}`}>
        <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>

      {/* Details Panel */}
      {panelOpenWidth > 0 && (
        <div className={`w-full ${panelOpenWidthClasses[panelOpenWidth as keyof typeof panelOpenWidthClasses]} h-full`}>
          <div className="flex flex-col h-full bg-white">
            <div className="flex justify-between p-4">
              {panelOpenWidth === 5 ? (
                <ArrowLeft onClick={() => setPanelOpenWidth(9)} />
              ) : (
                <ArrowRight onClick={() => setPanelOpenWidth(5)} />
              )}

              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setPanelOpenWidth(0)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 overflow-y-auto">
              <div className="flex-1 p-4">
                {/* Dynamic content based on selected item */}
                <h2 className="text-lg font-medium dark:text-white">Details</h2>
                {selectedItem &&
                  Object.entries(selectedItem).map(([key, value]) => (
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
