"use client";

import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-screen flex items-center justify-center px-4 md:px-8">
      <div
        className="
          max-w-6xl w-full flex flex-col md:flex-row items-center
          bg-white bg-opacity-20 dark:bg-gray-900 dark:bg-opacity-40
          backdrop-blur-md rounded-xl shadow-md
          p-6 md:p-10 md:mb-30 md:mt-20
          animate-fadeIn
        "
      >
        {/* Text Content */}
        <div className="text-gray-800 dark:text-green-300 md:w-1/2 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Fresh & Healthy <br /> Veggies & Fruits
          </h1>
          <p className="text-base opacity-90 drop-shadow-sm text-gray-500 dark:text-green-300">
            Discover the best organic produce from local farmers delivered right to your doorstep.
          </p>
          <button
            className="
              mt-3 
              bg-white bg-opacity-30 hover:bg-opacity-50 
              dark:bg-green-700 dark:hover:bg-green-600
              text-gray-800 font-semibold py-2 px-5 rounded-lg
              transition duration-300 shadow-sm shadow-gray-500 dark:shadow-none
            "
          >
            Shop Now
          </button>
        </div>

        {/* Image Placeholder */}
        <div className="mt-8 md:mt-0 md:ml-8 md:w-1/2 flex justify-center">
          <img
            src="/hero-icon.png"
            alt="Fresh fruits and vegetables"
            className="rounded-lg object-cover w-full max-w-md"
          />
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
