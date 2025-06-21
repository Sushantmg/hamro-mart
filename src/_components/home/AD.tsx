"use client";

import React from "react";
import Image from "next/image";

const AD: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-10 py-8 mt-20 dark:bg-gray-900">
      <div className="max-w-5xl max-h-[80vh] mx-auto flex flex-col md:flex-row gap-6 animate-fadeInUp">
        {/* Left side - 3 stacked cards */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Card 1 */}
          <div className="relative rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-900">
            <Image
              src="/jam.png"
              alt="Jam"
              width={400}     // Set width according to your design
              height={192}    // Maintain aspect ratio (example: 400x192 for 48 height with w-full)
              className="w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 p-4 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-lg font-semibold">Strawberry Jam</h2>
                <p className="text-sm">20% OFF</p>
              </div>
              <button className="mt-2 self-start bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition duration-200">
                Shop Now
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-900">
            <Image
              src="/chips.png"
              alt="Chips"
              width={400}
              height={192}
              className="w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 p-4 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-lg font-semibold">Organic Chips</h2>
                <p className="text-sm">Buy 1 Get 1 Free</p>
              </div>
              <button className="mt-2 self-start bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition duration-200">
                Shop Now
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-900">
            <Image
              src="/banana.png"
              alt="Banana"
              width={400}
              height={192}
              className="w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 p-4 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-lg font-semibold">Fresh Bananas</h2>
                <p className="text-sm">Up to 30% OFF</p>
              </div>
              <button className="mt-2 self-start bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition duration-200">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Right side - big card */}
        <div className="flex-1">
          <div className="relative h-full rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-900">
            <Image
              src="/basket.png"
              alt="Fruit Basket"
              width={600}   // Wider because it’s the big card
              height={480}  // Example aspect ratio
              className="w-full object-cover h-full"
              priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 p-6 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">Mixed Fruit Basket</h2>
                <p className="text-md mt-1">Limited Time Offer: 40% OFF</p>
              </div>
              <button className="mt-4 self-start bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg transition duration-200">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default AD;
