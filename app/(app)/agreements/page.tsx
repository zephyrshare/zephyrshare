// import { getAgreements } from '@/lib/actions';
import DataTable from '@/components/ui/data-table';
// import { columns } from './organizations-table-columns';
import UploadDocumentButton from './upload-document-button';

export default async function Page() {
  // const organizations = await getOrganizations();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <h1 className="font-cal text-3xl font-bold dark:text-white">Agreements</h1>
      <UploadDocumentButton />
      {/* <DataTable columns={columns} data={organizations} /> */}
    </div>
  );
}
