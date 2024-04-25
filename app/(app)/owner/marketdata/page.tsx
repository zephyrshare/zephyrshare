import PageContainer from '@/components/ui/page-container';
import { getMarketDataSources } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import AIChat from '@/components/ai-chat';
import { marketDataSourceTableColumns } from './data-source-table-columns';
import AddMarketDataButton from '@/components/add-market-data-button';
import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';

export default async function Page() {
  const marketDataSources = await getMarketDataSources();
  const session = await getSession();

  const user = session?.user;

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Market Data</h1>
      <AIChat />
      <AddMarketDataButton user={user} />
      <DataTableWithDetailPanel columns={marketDataSourceTableColumns} data={marketDataSources} />
    </PageContainer>
  );
}
