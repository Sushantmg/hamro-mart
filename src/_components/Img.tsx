"use client";

import Image from "next/image";
import React from "react";

const Img = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-900 px-4 transition-colors duration-500">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-7xl text-center">
        <h1 className="text-4xl font-extrabold text-green-500 drop-shadow mb-8 dark:text-green-300">
          Download our App!
        </h1>

        {/* App preview image */}
        <div className="relative w-full max-w-6xl mx-auto mb-10 aspect-[16/9]">
          <Image
            src="/webimg.webp"
            alt="App Preview"
            fill
            className="object-cover rounded-2xl shadow-xl border border-white/20 dark:border-white/10"
          />
        </div>

        {/* Download buttons */}
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="relative w-44 h-14">
            <Image
              src="/googleplay.webp"
              alt="Get it on Google Play"
              fill
              className="object-contain hover:scale-110 hover:rotate-1 transition-transform duration-300 shadow-lg rounded-lg"
            />
          </div>
          <div className="relative w-44 h-14">
            <Image
              src="/appstore.webp"
              alt="Download on the App Store"
              fill
              className="object-contain hover:scale-110 hover:-rotate-1 transition-transform duration-300 shadow-lg rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Img;
