"use client";

import Link from "next/link";
import { GiCarrot, GiFruitBowl } from "react-icons/gi";
import { MdLocalGroceryStore } from "react-icons/md";

const categories = [
  { icon: GiCarrot, label: "Vegetables", href: "/products?category=vegetables", color: "from-orange-400 to-orange-600" },
  { icon: GiFruitBowl, label: "Fruits", href: "/products?category=fruits", color: "from-red-400 to-red-600" },
  { icon: MdLocalGroceryStore, label: "All Products", href: "/products", color: "from-emerald-400 to-emerald-600" },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by <span className="text-emerald-600">Category</span></h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Browse our wide selection of fresh produce</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="group w-36 h-36 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon size={28} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
