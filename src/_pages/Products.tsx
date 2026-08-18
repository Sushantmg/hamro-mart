"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { HeartIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

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

function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchParams = useSearchParams();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/products")
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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filterSortSearchProducts = useCallback(() => {
    let tempProducts = [...products];

    if (categoryFilter !== "all") {
      tempProducts = tempProducts.filter((p) => p.category === categoryFilter);
    }

    if (searchTerm.trim() !== "") {
      tempProducts = tempProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      tempProducts.sort(
        (a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price)
      );
    } else if (sortOrder === "desc") {
      tempProducts.sort(
        (a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price)
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, searchTerm, sortOrder]);

  useEffect(() => {
    filterSortSearchProducts();
  }, [filterSortSearchProducts]);

  return (
    <div className="bg-green-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">
            {searchTerm ? `Results for "${searchTerm}"` : "Fresh Fruits & Vegetables"}
          </h2>
          {!loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg w-48 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            aria-label="Search products"
          />

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
          </select>

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            aria-label="Sort products by price"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">No products found.</p>
          <button
            onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setSortOrder(""); }}
            className="text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-all transform duration-150 relative"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                    toast.success(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className="absolute top-2 right-2 z-10 p-1"
                >
                  {isInWishlist(product.id) ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                  )}
                </button>

                <Link href={`/products/${product.id}`} className="w-full block">
                  <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: "cover" }}
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
                      <span className="line-through mr-2">${product.price.toFixed(2)}</span>
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

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-green-50 dark:bg-gray-900 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
