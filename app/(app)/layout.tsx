import { ReactNode, Suspense } from 'react';
import SidebarProfile from '@/components/sidebar-profile';
import Sidebar from '@/components/sidebar';
import TopNavbar from '@/components/top-navbar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Suspense fallback={<></>}>
        <TopNavbar />
      </Suspense>
      <Sidebar>
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarProfile />
        </Suspense>
      </Sidebar>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
