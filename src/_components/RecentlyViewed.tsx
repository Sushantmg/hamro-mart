"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function RecentlyViewed() {
  const { recent, clearRecent } = useRecentlyViewed();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || recent.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
        </div>
        <button onClick={clearRecent} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
          <XMarkIcon className="h-4 w-4" />
          Clear
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recent.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group card p-3 hover:shadow-md transition-all">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
              <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center truncate">{p.title}</h4>
            <p className="text-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${(p.discountedPrice ?? p.price).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
