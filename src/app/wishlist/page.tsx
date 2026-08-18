"use client";

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <HeartIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love for later.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">My Wishlist ({wishlist.length})</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const p = item.product;
            if (!p) return null;
            const discountedPrice = p.discount ? parseFloat(((p.price * (100 - p.discount)) / 100).toFixed(2)) : null;

            return (
              <div key={item.id} className="card group p-4">
                <Link href={`/products/${p.id}`} className="block">
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  {discountedPrice ? (
                    <>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${discountedPrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${p.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${p.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart({ id: p.id, title: p.name, price: p.price, discountedPrice, image: p.image });
                      toast.success("Added to cart!");
                    }}
                    className="flex-1 btn-primary !py-2 !text-sm flex items-center justify-center gap-1"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button onClick={() => toggleWishlist(p.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <HeartIcon className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
