'use client';

import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  discount: number;
};

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products'); // ✅ fixed here
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">🛍️ Manage Products</h1>
      <div className="overflow-x-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Discount</th>
                <th className="px-6 py-4 text-left">Final Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const discountedPrice =
                  p.discount > 0 ? p.price - (p.price * p.discount) / 100 : null;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50 transition duration-150 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold truncate max-w-[200px]">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {p.discount > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {p.discount}%
                        </span>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {discountedPrice !== null ? (
                        <span className="text-purple-600 font-medium">
                          ${discountedPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
