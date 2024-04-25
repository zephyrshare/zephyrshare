import PageContainer from '@/components/ui/page-container';
import { getMarketDataSources } from '@/lib/actions';
import AIChat from '@/components/ai-chat';
import { marketDataSourceTableColumns } from './data-source-table-columns';
import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';

export default async function Page() {
  // TODO: Implement a version of this function for Data Customers also
  const marketDataSources = await getMarketDataSources();

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Market Data</h1>
      <AIChat />
      <DataTableWithDetailPanel columns={marketDataSourceTableColumns} data={marketDataSources} />
    </PageContainer>
  );
}
