'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataContract } from '@prisma/client';
import { getContractStatusNamefromStatusType } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';

export const dataCustomerContractTableColumns: ColumnDef<DataContract>[] = [
  {
    header: 'Status',
    cell: ({ row }) => {
      const statusType: any = row.original.latestStatusType;
      const statusName = getContractStatusNamefromStatusType(statusType);
      return (
        <div className="flex space-x-2">
          {/* Format the status name like a chip (rounded, background light grey) using a span tag */}
          <span className="text-sm font-medium bg-slate-200 rounded-lg px-2 py-1">{statusName}</span>
        </div>
      );
    },
  },
  {
    header: 'Contract Dates',
    cell: ({ row }) => {
      // Should be formatted as "Mar '24 - Jun '25"
      // If user hovers over the dates, a tooltip should show the full date range formatted as Mar 1, 2024 - Jun 30, 2025
      if (!row.original.startDate || !row.original.endDate) {
        return null;
      }
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);
      const startDateFormatted = startDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      const endDateFormatted = endDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      const fullStartDate = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const fullEndDate = endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex space-x-2">
                <span className="text-sm font-medium">{`${startDateFormatted} - ${endDateFormatted}`}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex space-x-2">
                <span className="text-sm font-medium">{`${fullStartDate} - ${fullEndDate}`}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'marketDataSource.name',
    header: 'Market Data',
  },
  {
    accessorKey: 'dataOwner.name',
    header: 'Data Owner Name',
  },
  {
    header: 'Monthly Cost', // TODO: hardcoded as Monthly Cost for now, in the future allow dynamic price terms
    cell: ({ row }) => {
      const amount = row.original.contractAmount;
      const currencyUnit = row.original.contractCurrency;

      // Format the cost with commas and no decimal places, add the currency unit to the end of the amount after a space
      // If currencyUnit = "USD", prepend a "$" to the amount
      // If currencyUnit = "EUR", prepend a "€" to the amount
      // If currencyUnit = "GBP", prepend a "£" to the amount

      const currencySymbol =
        currencyUnit === 'USD' ? '$' : currencyUnit === 'EUR' ? '€' : currencyUnit === 'GBP' ? '£' : '';
      return (
        <div className="flex space-x-2">
          <span className="text-sm font-medium">
            {currencySymbol}
            {amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {currencyUnit}
          </span>
        </div>
      );
    },
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
