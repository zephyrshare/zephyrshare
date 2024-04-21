export default function TopNavbar() {
  return (
    <div className="fixed top-4 right-4 m-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-500 text-white text-lg font-bold">
          Z
        </div>
        <div className="text-lg font-semibold">Zonal Exchange</div>
        <div className="text-sm text-gray-500 uppercase">Data Owner</div>
      </div>
    </div>
  );
}
