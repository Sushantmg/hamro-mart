"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const grandTotal = totalPrice + shipping;

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items before checking out.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <CheckCircleIcon className="h-20 w-20 text-emerald-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Thank you for your purchase.</p>
        <div className="flex gap-3">
          <Link href="/orders" className="btn-primary">View Orders</Link>
          <Link href="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    const token = Cookies.get("ecom-token");
    if (!token) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      userId = payload.id;
    } catch {
      toast.error("Invalid session. Please login again.");
      router.push("/login");
      return;
    }

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
        body: JSON.stringify({ userId, items, total: grandTotal }),
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="section-title mb-8">Checkout</h1>

        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.title} &times; {item.quantity ?? 1}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${((item.discountedPrice ?? item.price) * (item.quantity ?? 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full">
          {loading ? "Placing Order..." : `Place Order — $${grandTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
