"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, ShoppingBagIcon, HeartIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

type UserInfo = {
  id: number;
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
    if (!token || token === "admin") {
      router.push("/login");
      return;
    }

    const userId = parseInt(token.replace("user-", ""), 10);

    fetch(`/api/users`)
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
            <UserIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              My Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/orders"
            className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 p-4 rounded-xl transition-colors"
          >
            <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{orderCount}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-3 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 p-4 rounded-xl transition-colors"
          >
            <HeartIcon className="h-8 w-8 text-pink-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{wishlistCount}</p>
              <p className="text-sm text-gray-500">Wishlist</p>
            </div>
          </Link>
        </div>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Order History
          </Link>
          <Link
            href="/wishlist"
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            My Wishlist
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
