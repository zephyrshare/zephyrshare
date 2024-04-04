import { getAgreementsByOrganization } from '@/lib/actions/actions';
import DataTable from '@/components/ui/data-table';
import { agreementTableColumns } from './agreement-table-columns';
import UploadAgreementButton from '@/components/upload-agreement-button';

export default async function Page() {
  const agreements = await getAgreementsByOrganization();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Agreements</h1>
      <UploadAgreementButton />
      <DataTable columns={agreementTableColumns} data={agreements} />
    </div>
  );
}
