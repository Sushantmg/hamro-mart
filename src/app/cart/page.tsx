"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Product } from "@/context/CartContext";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function Cart(): JSX.Element {
  const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

  return (
    <div className="pt-10 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-green-800 dark:text-green-300">Shopping Cart</h3>
          <p className="text-green-700 dark:text-green-200">
            {totalItems} item(s) | ${totalPrice.toFixed(2)}
          </p>
        </div>
        <button
          onClick={clearCart}
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all duration-200"
          disabled={cart.length === 0}
        >
          Clear Cart
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow p-12">
          <ShoppingBagIcon className="h-20 w-20 text-green-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Your cart is empty</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
            Looks like you haven’t added anything yet.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cart.map((item: Product) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                </div>
                <h4 className="text-green-800 dark:text-green-300 font-semibold text-lg text-center">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Price: ${( (item.discountedPrice ?? item.price) * (item.quantity || 1) ).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  type="button"
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                >
                  Remove One
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xl font-semibold text-green-800 dark:text-green-300">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
