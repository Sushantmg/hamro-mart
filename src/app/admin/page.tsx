"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ShoppingCartIcon, UserGroupIcon, TagIcon, CubeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

type Product = { id: number; name: string; price: number; discount: number; category: string };
type User = { id: number; name: string; email: string; role: string };

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: ReactNode; color: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    let isAdmin = false;
    if (token) {
      try {
        if (token === "admin") { isAdmin = true; }
        else { const p = JSON.parse(atob(token.split(".")[0])); isAdmin = p.role === "admin"; }
      } catch { /* not admin */ }
    }
    if (!isAdmin) { router.push("/login"); return; }

    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([p, u, o]) => {
      setProducts(p);
      setUsers(u);
      setOrders(o);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const discountedCount = products.filter((p) => p.discount > 0).length;
  const categories = [...new Set(products.map((p) => p.category))].length;
  const totalRevenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={products.length} icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600" />} color="bg-blue-100 dark:bg-blue-900/30" />
        <StatCard title="Total Users" value={users.length} icon={<UserGroupIcon className="h-6 w-6 text-emerald-600" />} color="bg-emerald-100 dark:bg-emerald-900/30" />
        <StatCard title="Total Orders" value={orders.length} icon={<CubeIcon className="h-6 w-6 text-purple-600" />} color="bg-purple-100 dark:bg-purple-900/30" />
        <StatCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon className="h-6 w-6 text-amber-600" />} color="bg-amber-100 dark:bg-amber-900/30" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard title="Categories" value={categories} icon={<TagIcon className="h-6 w-6 text-pink-600" />} color="bg-pink-100 dark:bg-pink-900/30" />
        <StatCard title="On Sale" value={discountedCount} icon={<TagIcon className="h-6 w-6 text-green-600" />} color="bg-green-100 dark:bg-green-900/30" />
        <StatCard title="Avg Order" value={orders.length > 0 ? `$${(totalRevenue / orders.length).toFixed(2)}` : "$0"} icon={<CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />} color="bg-indigo-100 dark:bg-indigo-900/30" />
      </div>
    </div>
  );
}
