'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import DataTable, { DataTableProps } from '@/components/ui/data-table';

const DEFAULT_PANEL_OPEN_WIDTH = 6;
const DEFAULT_PANEL_FULL_WIDTH = 8;
const PANEL_CLOSED_WIDTH = 0;

const panelOpenWidthClasses = {
  1: 'lg:w-1/12',
  2: 'lg:w-2/12',
  3: 'lg:w-3/12',
  4: 'lg:w-4/12',
  5: 'lg:w-5/12',
  6: 'lg:w-6/12',
  7: 'lg:w-7/12',
  8: 'lg:w-8/12',
  9: 'lg:w-9/12',
  10: 'lg:w-10/12',
  11: 'lg:w-11/12',
};

export default function DataTableWithDetailPanel<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [panelOpenWidth, setPanelOpenWidth] = useState(PANEL_CLOSED_WIDTH); // 0 = closed, 5 = half, 10 = full
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const handleRowClick = (item: TData) => {
    setSelectedItem(item);
    setPanelOpenWidth(DEFAULT_PANEL_OPEN_WIDTH);
  };

  // Effect to handle the Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && panelOpenWidth > 0) {
        setPanelOpenWidth(PANEL_CLOSED_WIDTH);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [panelOpenWidth]);

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
              {panelOpenWidth === DEFAULT_PANEL_OPEN_WIDTH ? (
                <ArrowLeftCircle
                  className="text-gray-500"
                  onClick={() => setPanelOpenWidth(DEFAULT_PANEL_FULL_WIDTH)}
                />
              ) : (
                <ArrowRightCircle
                  className="text-gray-500"
                  onClick={() => setPanelOpenWidth(DEFAULT_PANEL_OPEN_WIDTH)}
                />
              )}

              <div className="flex flex-row">
                <button
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 text-md"
                  onClick={() => setPanelOpenWidth(PANEL_CLOSED_WIDTH)}
                >
                  close
                </button>
                {/* ESC button with a thin rounded border */}
                {/* To make text smaller than text-xs, use: text-[0.625rem] content-center p-[0.125rem] */}
                <div className="ml-2 border rounded text-gray-400 dark:text-gray-400  border-gray-300 text-[0.625rem] content-center p-[0.125rem]">
                  ESC
                </div>
              </div>
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
