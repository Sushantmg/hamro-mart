'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-50 via-white to-purple-100 border-r border-gray-200">
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
          Admin Panel
        </div>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 space-x-3 text-gray-700 hover:bg-purple-100 hover:rounded-lg transition-all ${
                  isActive ? 'bg-purple-200 font-semibold rounded-lg' : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-100 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
