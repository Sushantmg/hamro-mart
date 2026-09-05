"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBagIcon, CheckCircleIcon, ClockIcon, TruckIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

type OrderItem = { productId: number; name: string; price: number; quantity: number };
type Order = { id: number; userId: number; items: OrderItem[]; total: number; status: string; createdAt: string; shipping?: { fullName: string; address: string; city: string; phone: string } };

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const timelineSteps = ["pending", "processing", "shipped", "delivered"];
const timelineIcons = [ClockIcon, ClipboardDocumentCheckIcon, TruckIcon, CheckCircleIcon];

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        Order Cancelled
      </div>
    );
  }

  const currentIdx = timelineSteps.indexOf(status);
  if (currentIdx === -1) return null;

  return (
    <div className="flex items-center gap-0 mt-4">
      {timelineSteps.map((step, i) => {
        const Icon = timelineIcons[i];
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
              } ${isCurrent ? "ring-2 ring-emerald-300 dark:ring-emerald-700" : ""}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] mt-1 capitalize font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentIdx ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    if (!token) { router.push("/login"); return; }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      userId = payload.id;
    } catch { router.push("/login"); return; }

    fetch(`/api/orders?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-2">Your order history will appear here.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Start shopping to place your first order!</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="section-title mb-2">Order History</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <span className={`badge ${statusStyles[order.status] || "bg-gray-100 text-gray-800"}`}>
                  {order.status}
                </span>
              </div>

              <OrderTimeline status={order.status} />

              {order.shipping && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Deliver to</p>
                  <p>{order.shipping.fullName} · {order.shipping.address}, {order.shipping.city}</p>
                  <p>{order.shipping.phone}</p>
                </div>
              )}

              <div className="border-t mt-4 pt-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.name} &times; {item.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
