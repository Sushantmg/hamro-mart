'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number | string;
  discount: number;
}

interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:3007/products')
      .then((res) => res.json())
      .then((data: ApiProduct[]) => {
        const updatedData: Product[] = data.map((item) => {
          const priceNum = Number(item.price);
          const discountedPrice = item.discount
            ? parseFloat(((priceNum * (100 - item.discount)) / 100).toFixed(2))
            : null;

          return {
            id: item.id,
            title: `Fresh ${item.name}`,
            category: item.category,
            image: item.image,
            description: item.desc,
            price: priceNum,
            discount: item.discount,
            discountedPrice,
          };
        });

        setProducts(updatedData);
        setFilteredProducts(updatedData);
      })
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const filterSortSearchProducts = () => {
    let tempProducts = [...products];

    if (categoryFilter !== 'all') {
      tempProducts = tempProducts.filter((p) => p.category === categoryFilter);
    }

    if (searchTerm.trim() !== '') {
      tempProducts = tempProducts.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === 'asc') {
      tempProducts.sort(
        (a, b) =>
          (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price)
      );
    } else if (sortOrder === 'desc') {
      tempProducts.sort(
        (a, b) =>
          (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price)
      );
    }

    setFilteredProducts(tempProducts);
  };

  React.useEffect(() => {
    filterSortSearchProducts();
  }, [sortOrder, categoryFilter, searchTerm, products]);

  return (
    <div className="bg-green-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">
          Fresh Fruits & Vegetables
        </h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border rounded w-48 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            aria-label="Search products"
          />

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
            className="px-3 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
          </select>

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="px-3 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            aria-label="Sort products by price"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-all transform duration-150"
          >
            <Link href={`/products/${product.id}`} className="w-full block">
              <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  priority={false}
                />
              </div>

              <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-1 text-center">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                {product.description}
              </p>
            </Link>

            <div className="mb-2 text-center">
              {product.discount > 0 ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  <span className="line-through mr-2">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="font-bold text-green-800 dark:text-green-200">
                    ${product.discountedPrice?.toFixed(2)}
                  </span>
                  <span className="ml-1 text-xs text-red-500 dark:text-red-300">
                    ({product.discount}% OFF)
                  </span>
                </div>
              ) : (
                <div className="text-green-700 dark:text-green-200 font-semibold text-sm">
                  ${product.price.toFixed(2)}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.title} added to cart!`);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mt-auto"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
