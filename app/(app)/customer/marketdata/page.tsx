import PageContainer from '@/components/ui/page-container';
import { getMarketDataSourcesForDataCustomer } from '@/lib/actions';
import AIChat from '@/components/ai-chat';
import { marketDataSourceTableColumns } from './data-source-table-columns';
import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';

export default async function Page() {
  const marketDataSources = await getMarketDataSourcesForDataCustomer();

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Market Data</h1>
      <AIChat />
      <DataTableWithDetailPanel columns={marketDataSourceTableColumns} data={marketDataSources} />
    </PageContainer>
  );
}
