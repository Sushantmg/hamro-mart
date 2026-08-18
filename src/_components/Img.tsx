"use client";

import Image from "next/image";

export default function Img() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title mb-2">Download our <span className="text-emerald-600">App</span></h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10">Shop on the go with our mobile app</p>

        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-8">
          <Image
            src="/webimg.webp"
            alt="HamroMart App Preview"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex justify-center gap-4">
          <div className="relative w-40 h-12">
            <Image src="/googleplay.webp" alt="Get it on Google Play" fill className="object-contain" />
          </div>
          <div className="relative w-40 h-12">
            <Image src="/appstore.webp" alt="Download on the App Store" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
