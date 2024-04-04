import { getDataFilesByOrganization } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import DataTable from '@/components/ui/data-table';
import { dataFileTableColumns } from './file-table-columns';
import UploadFileButton from '@/components/upload-file-button';

export default async function Page() {
  const datafiles = await getDataFilesByOrganization();
  const session = await getSession();

  const user = session?.user;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Data Files</h1>
      <UploadFileButton user={user} />
      <DataTable columns={dataFileTableColumns} data={datafiles} />
    </div>
  );
}
