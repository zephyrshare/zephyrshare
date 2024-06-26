import AddContractDataButton from '@/components/add-contract-data-button';
import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';
import PageContainer from '@/components/ui/page-container';
import { getDataCustomers, getMarketDataSources, getDataContractsOfDataOwner } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import { dataOwnerContractTableColumns } from './data-owner-contract-table-columns';

export default async function Page() {
  const [marketDataSources, customers, dataContracts] = await Promise.all([
    getMarketDataSources(),
    getDataCustomers(),
    getDataContractsOfDataOwner(),
  ]);

  const session = await getSession();

  const user = session?.user;

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Contracts</h1>
      <div className="flex flex-col w-full">
        <AddContractDataButton user={user} marketDataSources={marketDataSources} customers={customers} />
      </div>
      <DataTableWithDetailPanel columns={dataOwnerContractTableColumns} data={dataContracts} />
    </PageContainer>
  );
}
