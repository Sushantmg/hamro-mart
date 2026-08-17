"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (cart.length === 0 && !success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Order Placed!
        </h2>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    const token = Cookies.get("ecom-token");
    if (!token || token === "admin") {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    const userId = parseInt(token.replace("user-", ""), 10);
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: Number(item.id),
        name: item.title,
        price: item.discountedPrice ?? item.price,
        quantity: item.quantity ?? 1,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items, total: totalPrice }),
      });

      if (res.ok) {
        clearCart();
        setSuccess(true);
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
        Checkout
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Order Summary
        </h2>
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.title} x {item.quantity ?? 1}
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                ${((item.discountedPrice ?? item.price) * (item.quantity ?? 1)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
          <span className="text-lg font-bold text-green-700 dark:text-green-300">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
