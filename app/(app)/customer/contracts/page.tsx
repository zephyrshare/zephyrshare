import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';
import PageContainer from '@/components/ui/page-container';
import { getDataContractsOfDataCustomer } from '@/lib/actions';
import { dataContractTableColumns } from './data-contract-table-columns';

export default async function Page() {
  const dataContracts = await getDataContractsOfDataCustomer();

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Contracts</h1>
      <DataTableWithDetailPanel columns={dataContractTableColumns} data={dataContracts} />
    </PageContainer>
  );
}
