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
  const [step, setStep] = useState<"shipping" | "review">("shipping");
  const [shipping, setShipping] = useState({ fullName: "", address: "", city: "", phone: "" });

  const shippingCost = totalPrice >= 50 ? 0 : 4.99;
  const grandTotal = totalPrice + shippingCost;

  const shippingValid = shipping.fullName.trim() && shipping.address.trim() && shipping.city.trim() && shipping.phone.trim();

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <ArrowLeftIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-2">Add items before checking out.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Your cart is waiting to be filled with fresh produce!</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <CheckCircleIcon className="h-14 w-14 text-emerald-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Your order is being processed and will be delivered to {shipping.city}.</p>
        <div className="flex gap-3">
          <Link href="/orders" className="btn-primary">View My Orders</Link>
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
        body: JSON.stringify({ userId, items, total: grandTotal, shipping }),
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

        <h1 className="section-title mb-2">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          <span className={`font-medium ${step === "shipping" ? "text-emerald-600" : "text-gray-500"}`}>1. Shipping</span>
          <span className="text-gray-300 dark:text-gray-600">→</span>
          <span className={`font-medium ${step === "review" ? "text-emerald-600" : "text-gray-500"}`}>2. Review</span>
        </div>

        {step === "shipping" && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input id="fullName" type="text" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="John Doe" className="input-field" required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input id="address" type="text" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="123 Main Street" className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input id="city" type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Kathmandu" className="input-field" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input id="phone" type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+977 9800000000" className="input-field" required />
                </div>
              </div>
            </div>
            <button onClick={() => shippingValid ? setStep("review") : toast.error("Please fill all shipping fields")} className="btn-primary w-full mt-6">
              Continue to Review
            </button>
          </div>
        )}

        {step === "review" && (
          <>
            <div className="card p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">Shipping To</h2>
                <button onClick={() => setStep("shipping")} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Edit</button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{shipping.fullName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{shipping.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{shipping.city} · {shipping.phone}</p>
            </div>

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
                  <span className={shippingCost === 0 ? "text-emerald-600 font-medium" : ""}>
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
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
          </>
        )}
      </div>
    </div>
  );
}
