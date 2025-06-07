"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // ✅ Use Next.js Link

type Product = {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 4)); // Only first 4 products
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const productCards = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    productCards.push(
      <div
        key={p.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center"
      >
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">
          Fresh {p.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
          {p.desc}
        </p>
        <div className="text-green-700 dark:text-green-200 font-semibold text-sm">
          ${parseFloat(p.price).toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-4">
        Fresh Fruits & Vegetables
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productCards}
      </div>

      {/* View More Button */}
      <div className="mt-8 flex justify-center">
        <Link href="/products">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
            View More
          </button>
        </Link>
      </div>
    </div>
  );
}
