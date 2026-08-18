"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-[80vh] flex items-center justify-center px-4 md:px-8">
      <div
        className="
          max-w-6xl w-full flex flex-col md:flex-row items-center
          bg-white bg-opacity-20 dark:bg-gray-900 dark:bg-opacity-40
          backdrop-blur-md rounded-xl shadow-md
          p-6 md:p-10 md:mb-30 md:mt-20
        "
      >
        <div className="text-gray-800 dark:text-green-300 md:w-1/2 space-y-4">
          <span className="inline-block bg-white/30 dark:bg-green-800/50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Fresh & Organic
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            Fresh & Healthy <br /> Veggies & Fruits
          </h1>
          <p className="text-base opacity-90 drop-shadow-sm text-gray-500 dark:text-green-300">
            Discover the best organic produce from local farmers delivered right to your doorstep. 
            Farm fresh, naturally grown, and full of flavor.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/products"
              className="
                bg-white hover:bg-gray-100
                dark:bg-green-700 dark:hover:bg-green-600
                text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg
                transition duration-300 shadow-sm
              "
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=fruits"
              className="
                border-2 border-white/50 hover:bg-white/10
                dark:border-green-500/50 dark:hover:bg-green-800/30
                text-white font-semibold py-3 px-6 rounded-lg
                transition duration-300
              "
            >
              Browse Fruits
            </Link>
          </div>
          <div className="flex gap-6 pt-4 text-sm text-gray-600 dark:text-green-200">
            <div className="flex items-center gap-1">
              <span className="text-lg">&#127815;</span> Farm Fresh
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">&#128666;</span> Fast Delivery
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">&#10003;</span> 100% Organic
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:ml-8 md:w-1/2 flex justify-center">
          <Image
            src="/hero-icon.png"
            alt="Fresh fruits and vegetables"
            className="rounded-lg object-cover"
            width={400}
            height={300}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
