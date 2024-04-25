import PageContainer from '@/components/ui/page-container';
import { getDataCustomers } from '@/lib/actions';
import DataTableWithDetailPanel from '@/components/ui/data-table-with-detail-panel';
import { customersTableColumns } from './customers-table-columns';
import AddCustomerButton from './add-customer-dialog-button';

export default async function Page() {
  const customers = await getDataCustomers();

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Data Customers</h1>
      <AddCustomerButton />
      <DataTableWithDetailPanel columns={customersTableColumns} data={customers} />
    </PageContainer>
  );
}
