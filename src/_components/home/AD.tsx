"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const promos = [
  {
    title: "Strawberry Jam",
    subtitle: "20% OFF",
    image: "/jam.png",
    href: "/products?category=fruits",
  },
  {
    title: "Fresh Bananas",
    subtitle: "Best Sellers",
    image: "/banana.png",
    href: "/products?category=fruits",
  },
  {
    title: "Organic Chips",
    subtitle: "New Arrival",
    image: "/chips.png",
    href: "/products",
  },
];

export default function PromoSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Special <span className="text-emerald-600">Offers</span></h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Don&apos;t miss out on these amazing deals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              className="group relative overflow-hidden rounded-2xl h-64 bg-gray-900"
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {promo.subtitle}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                  Shop Now <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Big featured card */}
        <Link href="/products" className="group relative overflow-hidden rounded-2xl mt-6 h-48 md:h-64 bg-gray-900 block">
          <Image
            src="/basket.png"
            alt="Fruit Basket"
            fill
            className="object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-12">
            <div>
              <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                Limited Time — 40% OFF
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Mixed Fruit Basket</h3>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                Order Now <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
