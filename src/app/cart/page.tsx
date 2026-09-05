"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartProduct } from "@/context/CartContext";
import { ShoppingBagIcon, TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const router = useRouter();

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Shopping Cart</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""} &middot; ${totalPrice.toFixed(2)}</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="btn-danger !text-sm !px-4 !py-2" aria-label="Clear all items from cart">
              <TrashIcon className="h-4 w-4 mr-1 inline" />
              Clear All
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="card p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Looks like you haven&apos;t added anything yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Browse our fresh products and add your favorites!</p>
            <Link href="/products" className="btn-primary inline-flex">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item: CartProduct) => {
                const finalPrice = item.discountedPrice ?? item.price;
                return (
                  <div key={item.id} className="card p-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <ShoppingBagIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">${finalPrice.toFixed(2)} each</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">{item.quantity ?? 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ${(finalPrice * (item.quantity ?? 1)).toFixed(2)}
                          </span>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 p-1" aria-label={`Remove ${item.title} from cart`}>
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-emerald-600">{totalPrice >= 50 ? "Free" : "$4.99"}</span>
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}
                </span>
              </div>
              <button onClick={() => router.push("/checkout")} className="btn-primary w-full mt-4">
                Proceed to Checkout
              </button>
              {totalPrice < 50 && (
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
