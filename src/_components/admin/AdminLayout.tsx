// app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { href: '/admin/products', label: 'Products', Icon: CubeIcon },
  { href: '/admin/users', label: 'Users', Icon: UserGroupIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('ecom-token');
    if (token === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return <div className="text-center p-10 text-red-500 text-lg">You are not admin</div>;
    // Or redirect: router.push('/');
  }

  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 fixed">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex w-64 bg-gray-900 text-white flex-col py-6 px-4 shadow-lg">
        <Link
          href="/"
          className="flex items-center space-x-2 mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-semibold">Go Home</span>
        </Link>

        <h2 className="text-3xl font-bold mb-8 tracking-tight">Admin Panel</h2>

        <nav className="flex flex-col space-y-3">
          {navItems.map(({ href, label, Icon }) => (
            <NavItem key={href} href={href} label={label} Icon={Icon} pathname={pathname} />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto pb-20 lg:pb-8 pl-10">{children}</main>

      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center h-16 lg:hidden shadow-inner">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-xs text-gray-500 px-4 hover:text-blue-500"
        >
          <ArrowLeftIcon className="h-6 w-6 mb-1" />
          <span>Home</span>
        </Link>

        {navItems.map(({ href, label, Icon }) => (
          <BottomNavItem
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            pathname={pathname}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItem({
  href,
  label,
  Icon,
  pathname,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-gray-800 text-white font-semibold'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

function BottomNavItem({
  href,
  label,
  Icon,
  pathname,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center text-xs text-gray-500 px-4 ${
        isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-500'
      }`}
    >
      <Icon className="h-6 w-6 mb-1" />
      <span>{label}</span>
    </Link>
  );
}
