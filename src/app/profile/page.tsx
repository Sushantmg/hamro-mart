"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, ShoppingBagIcon, HeartIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

type UserInfo = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    if (!token) { router.push("/login"); return; }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      userId = payload.id;
    } catch { router.push("/login"); return; }

    fetch("/api/users")
      .then((res) => res.json())
      .then((users) => {
        const found = users.find((u: UserInfo) => u.id === userId);
        if (found) setUser(found);
      });

    fetch(`/api/orders?userId=${userId}`)
      .then((res) => res.json())
      .then((orders) => setOrderCount(orders.length));

    fetch(`/api/wishlist?userId=${userId}`)
      .then((res) => res.json())
      .then((items) => setWishlistCount(items.length));
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("ecom-token");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/orders" className="card p-4 hover:shadow-md transition-shadow">
              <ShoppingBagIcon className="h-6 w-6 text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orderCount}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </Link>
            <Link href="/wishlist" className="card p-4 hover:shadow-md transition-shadow">
              <HeartIcon className="h-6 w-6 text-red-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistCount}</p>
              <p className="text-sm text-gray-500">Wishlist</p>
            </Link>
          </div>

          <div className="space-y-2">
            <Link href="/orders" className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
              Order History
            </Link>
            <Link href="/wishlist" className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
              My Wishlist
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600 font-medium">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
