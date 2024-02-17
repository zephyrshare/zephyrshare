import { getAgreements } from '@/lib/actions';
import DataTable from '@/components/ui/data-table';
import { columns } from './agreement-table-columns';
import UploadDocumentButton from '@/components/upload-document-button';

export default async function Page() {
  const agreements = await getAgreements();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <h1 className="font-cal text-3xl font-bold dark:text-white">Agreements</h1>
      <UploadDocumentButton />
      <DataTable columns={columns} data={agreements} />
    </div>
  );
}
