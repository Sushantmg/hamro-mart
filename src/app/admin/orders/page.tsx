"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

type OrderItem = { productId: number; name: string; price: number; quantity: number };
type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shipping?: { fullName: string; address: string; city: string; phone: string };
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    let isAdmin = false;
    if (token) {
      try {
        if (token === "admin") isAdmin = true;
        else { const p = JSON.parse(atob(token.split(".")[0])); isAdmin = p.role === "admin"; }
      } catch { /* not admin */ }
    }
    if (!isAdmin) { router.push("/login"); return; }
    fetchOrders();
  }, [router]);

  const updateStatus = async (orderId: number, status: string) => {
    const res = await fetch(`/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      toast.success(`Order #${orderId} updated to ${status}`);
      fetchOrders();
    } else {
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Order #{order.id}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                    {new Date(order.createdAt).toLocaleDateString()} · User #{order.userId}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.shipping && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {order.shipping.fullName} · {order.shipping.address}, {order.shipping.city} · {order.shipping.phone}
                </p>
              )}

              <div className="border-t pt-3">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
                      {item.name} &times; {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
