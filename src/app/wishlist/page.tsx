"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 animate-pulse">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <HeartIcon className="h-20 w-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">Save items you love for later.</p>
        <Link
          href="/products"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
        My Wishlist ({wishlist.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const p = item.product;
          if (!p) return null;
          const discountedPrice = p.discount
            ? parseFloat(((p.price * (100 - p.discount)) / 100).toFixed(2))
            : null;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-all duration-150"
            >
              <Link href={`/products/${p.id}`} className="w-full block">
                <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 className="text-lg font-bold text-green-700 dark:text-green-300 text-center mb-1">
                  Fresh {p.name}
                </h3>
              </Link>
              <div className="mb-3 text-center">
                {discountedPrice ? (
                  <div className="text-sm">
                    <span className="line-through text-gray-400 mr-2">${p.price.toFixed(2)}</span>
                    <span className="font-bold text-green-800 dark:text-green-200">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-green-700 dark:text-green-200 font-semibold">
                    ${p.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    addToCart({
                      id: p.id,
                      title: `Fresh ${p.name}`,
                      price: p.price,
                      discountedPrice,
                      image: p.image,
                    });
                    toast.success("Added to cart!");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="text-red-500 hover:text-red-600 px-3 py-2 rounded border border-red-300"
                  title="Remove from wishlist"
                >
                  <HeartIcon className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
