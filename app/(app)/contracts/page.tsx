import AddContractDataButton from '@/components/add-contract-data-button';
import PageContainer from '@/components/ui/page-container';
import {
  getCustomersByOrganization,
  getMarketDataSourcesByOrganization,
} from '@/lib/actions';
import { getSession } from '@/lib/auth';

export default async function Page() {
  const [marketDataSources, customers] = await Promise.all([
    getMarketDataSourcesByOrganization(),
    getCustomersByOrganization(),
  ]);

  const session = await getSession();

  const user = session?.user;

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">
        Contracts
      </h1>
      <div className="flex flex-col w-full">
        <AddContractDataButton
          user={user}
          marketDataSources={marketDataSources}
          customers={customers}
        />
      </div>
    </PageContainer>
  );
}
