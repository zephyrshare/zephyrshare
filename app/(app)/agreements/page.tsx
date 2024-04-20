import PageContainer from '@/components/ui/page-container';
import { getAgreementsByOrganization } from '@/lib/actions';
import DataTable from '@/components/ui/data-table';
import { agreementTableColumns } from './agreement-table-columns';
import UploadAgreementButton from '@/components/upload-agreement-button';

export default async function Page() {
  const agreements = await getAgreementsByOrganization();

  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Agreements</h1>
      <UploadAgreementButton />
      <DataTable columns={agreementTableColumns} data={agreements} />
    </PageContainer>
  );
}
