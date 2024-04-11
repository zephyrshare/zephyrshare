import { getMarketDataSourcesByOrganization } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import AIChat from '@/components/ai-chat';
import DataTable from '@/components/ui/data-table';
import { marketDataSourceTableColumns } from './data-source-table-columns';
import AddMarketDataButton from '@/components/add-market-data-button';

export default async function Page() {
  const marketDataSources = await getMarketDataSourcesByOrganization();
  const session = await getSession();

  const user = session?.user;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Market Data</h1>
      <AIChat />
      <AddMarketDataButton user={user} />
      <DataTable columns={marketDataSourceTableColumns} data={marketDataSources} />
    </div>
  );
}
