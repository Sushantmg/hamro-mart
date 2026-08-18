"use client";

import Image from "next/image";
import Link from "next/link";
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Fresh &amp; Organic
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                Fresh Groceries<br />
                <span className="text-emerald-100">Delivered Fast</span>
              </h1>
            </div>
            <p className="text-lg text-emerald-50/80 max-w-lg leading-relaxed">
              Discover the best organic produce from local farmers. Farm fresh, naturally grown, and delivered right to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl">
                Shop Now
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/products?category=fruits" className="inline-flex items-center border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                Browse Fruits
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                { icon: "🌿", text: "Farm Fresh" },
                { icon: "🚚", text: "Free Delivery" },
                { icon: "✓", text: "100% Organic" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-emerald-50/90">
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-white/10 rounded-3xl rotate-6 scale-95" />
              <Image
                src="/hero-icon.png"
                alt="Fresh fruits and vegetables"
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features bar */}
      <div className="relative z-10 -mb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TruckIcon, title: "Free Shipping", desc: "Orders over $50" },
              { icon: ArrowPathIcon, title: "Easy Returns", desc: "3-day return policy" },
              { icon: ShieldCheckIcon, title: "Secure Payment", desc: "100% protected" },
              { icon: PhoneIcon, title: "24/7 Support", desc: "We're here to help" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
