import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function TopNavbar() {
  // TODO: consolidate these getSession calls
  const session = await getSession();

  // TOOD: Implement the Data Owner or Data Customer info populating here

  // NOTE, Only the icon is visible on mobile
  return (
    <div className="fixed top-4 right-4 m-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-500 text-white text-md font-bold">
          Z
        </div>
        <Link href="/orgsettings" className="hidden md:flex">
          <div className="text-md font-semibold">Zonal Exchange</div>
        </Link>
        <div className="text-sm text-gray-400 uppercase hidden md:flex">Data Owner</div>
      </div>
    </div>
  );
}
