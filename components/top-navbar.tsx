import Link from 'next/link';

export default function TopNavbar() {
  // NOTE, Only the icon is visible on mobile
  return (
    <div className="fixed top-4 right-4 m-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-500 text-white text-md font-bold">
          Z
        </div>
        <Link href="/organizationsettings" className="hidden md:flex">
          <div className="text-md font-semibold">Zonal Exchange</div>
        </Link>
        <div className="text-sm text-gray-400 uppercase hidden md:flex">Data Owner</div>
      </div>
    </div>
  );
}
