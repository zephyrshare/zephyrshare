'use client';

import Link from 'next/link';
import { Globe, LayoutDashboard, Megaphone, Menu, Newspaper, Settings } from 'lucide-react';
import { useParams, usePathname, useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import WindIcon from '@/components/icons/wind-icon';

const externalLinks = [
  {
    name: 'Read announcement',
    href: `${process.env.NEXTAUTH_URL}`,
    icon: <Megaphone width={18} />,
  },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();

  const tabs = useMemo(() => {
    return [
      {
        name: 'Dashboard',
        href: '/',
        isActive: segments.includes("dashboard"),
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: 'Organizations',
        href: '/organizations',
        isActive: segments.includes("organizations"),
        icon: <Globe width={18} />,
      },
      {
        name: 'Agreements',
        href: '/agreements',
        isActive: segments.includes("agreements"),
        icon: <Newspaper width={18} />,
      },
      {
        name: 'Settings',
        href: '/settings',
        isActive: segments.includes("settings"),
        icon: <Settings width={18} />,
      },
    ];
  }, [segments]);

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
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <div className="flex items-center">
              <p className="text-xl font-bold">Zephyr Share</p>
              <WindIcon className="ml-1" size={16} />
            </div>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? 'bg-stone-200 text-black dark:bg-stone-700' : ''
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700">{children}</div>
        </div>
      </div>
    </>
  );
}
