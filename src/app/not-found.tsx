"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-extrabold text-green-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
