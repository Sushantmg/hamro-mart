'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import {
  ShoppingCartIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  category: string;
};

type User = {
  id: number;
  email: string;
  password: string;
};

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await fetch('http://localhost:3007/products');
        const userRes = await fetch('http://localhost:3007/users');
        const productsData = await productRes.json();
        const usersData = await userRes.json();

        setProducts(productsData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const discountedProducts = products.filter((p) => p.discount > 0);
  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">📊 Admin Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<ShoppingCartIcon className="h-8 w-8 text-blue-600" />}
          gradient="from-blue-100 to-blue-300"
        />
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<UserGroupIcon className="h-8 w-8 text-green-600" />}
          gradient="from-green-100 to-green-300"
        />
        <StatCard
          title="Discounted Products"
          value={discountedProducts.length}
          icon={<TagIcon className="h-8 w-8 text-yellow-600" />}
          gradient="from-yellow-100 to-yellow-300"
        />
        <StatCard
          title="Product Categories"
          value={categories.length}
          icon={<CubeIcon className="h-8 w-8 text-purple-600" />}
          gradient="from-purple-100 to-purple-300"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} backdrop-blur-md rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-white rounded-full shadow-md">{icon}</div>
        <div>
          <p className="text-sm text-gray-600 font-semibold uppercase">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
