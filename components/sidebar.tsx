'use client';

// TODO - Consider making Sidebar a server component, to prevent exposing all UserRoles to all users
// TODO - consider the problem of possibly exposing all UserRoles to all users by importing getBaseUrlPath from '@/lib/user-roles-privileges'?

import Link from 'next/link';
import { Globe, LayoutDashboard, Menu, Settings, HeartHandshake } from 'lucide-react';
import { usePathname, useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getBaseUrlPath } from '@/lib/user-roles-privileges';
import WindIcon from '@/components/icons/wind-icon';

export default function Sidebar({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { data: session } = useSession();
  // @ts-ignore
  const baseUrlPath = getBaseUrlPath(session?.user?.role);

  const tabs = useMemo(() => {
    let tabLinks = [
      {
        name: 'Market Data',
        href: `${baseUrlPath}/marketdata`,
        isActive: segments.includes('marketdata'),
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: 'Contracts',
        href: `${baseUrlPath}/contracts`,
        isActive: segments.includes('contracts'),
        icon: <HeartHandshake width={18} />,
      },
    ];

    if (baseUrlPath === '/owner') {
      tabLinks.push({
        name: 'Customers',
        href: `${baseUrlPath}/customers`,
        isActive: segments.includes('customers'),
        icon: <Globe width={18} />,
      });
    } else if (baseUrlPath === '/customer') {
      // Customer specific tabs
    }

    // Keep the organization settings tab at the end
    tabLinks.push({
      name: 'Organization Settings',
      href: `${baseUrlPath}/orgsettings`,
      isActive: segments.includes('orgsettings'),
      icon: <Settings width={18} />,
    });

    return tabLinks;
  }, [segments, baseUrlPath]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          true && !showSidebar ? 'left-5 top-5' : 'right-5 top-7'
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-neutral-50 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <div className="flex items-center">
              <p className="text-lg font-medium">ZephyrShare</p>
              <WindIcon className="ml-1" size={16} />
            </div>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive
                    ? 'bg-slate-200 text-black dark:bg-stone-700 decoration-dotted underline underline-offset-4'
                    : ''
                } rounded-lg px-2 py-1.5 hover:bg-slate-200 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-normal">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 py-2 border-t border-stone-200 dark:border-stone-700">{children}</div>
        </div>
      </div>
    </>
  );
}
