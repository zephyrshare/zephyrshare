'use client';

import { useState } from 'react';
import Link from 'next/link';
import HamburgerIcon from '@/components/icons/hamburger-icon';
import WindIcon from '@/components/icons/wind-icon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-full justify-between flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-xl font-bold">ZephyrShare</div>
                <WindIcon className="ml-1" size={16} />
              </div>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/about">
                  <div className="text-gray-600 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </div>
                </Link>
                <Link href="/example">
                  <div className="text-gray-600 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                    Example
                  </div>
                </Link>
                <Link href="/login">
                  <div className="text-gray-600 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-400 focus:outline-none">
              <HamburgerIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? '' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/about">
            <div className="text-gray-600 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium">
              About
            </div>
          </Link>
          <Link href="/example">
            <div className="text-gray-600 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium">
              Example
            </div>
          </Link>
          <Link href="/login">
            <div className="text-gray-600 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium">
              Login
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
