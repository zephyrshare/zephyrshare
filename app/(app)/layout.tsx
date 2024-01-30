import { ReactNode, Suspense } from "react";
import SidebarProfile from "@/components/sidebar-profile";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Sidebar>
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarProfile />
        </Suspense>
      </Sidebar>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
