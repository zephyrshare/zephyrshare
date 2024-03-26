import { getAgreementsByOrganization } from '@/lib/actions';
import DataTable from '@/components/ui/data-table';
import { columns } from './agreement-table-columns';
import UploadAgreementButton from '@/components/upload-agreement-button';
import S3UploadButton from '@/components/s3-upload-button';

export default async function Page() {
  const agreements = await getAgreementsByOrganization();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Agreements</h1>
      {/* <UploadAgreementButton /> */}
      <S3UploadButton />
      <DataTable columns={columns} data={agreements} />
    </div>
  );
}
