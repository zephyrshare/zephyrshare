import { getSession } from "@/lib/auth";
import { getOrganizations } from '@/lib/actions';
import rbac, { Privilege } from '@/lib/user-roles-privileges';
import DataTable from '@/components/ui/data-table';
import { customersTableColumns } from './customers-table-columns';
import AddCustomerButton from './add-customer-dialog-button';

export default async function Page() {
  const session = await getSession();
  const customers = await getOrganizations();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Customer Organizations</h1>
      {rbac(session?.user.role, Privilege.CUSTOMER_CRUD) && <AddCustomerButton />}
      <DataTable columns={customersTableColumns} data={customers} />
    </div>
  );
}
