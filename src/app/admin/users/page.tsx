"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TrashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type User = { id: number; name: string; email: string; role: string };

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("User deleted!"); fetchUsers(); }
    else { toast.error("Failed to delete"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{users.length} registered users</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-500">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.role === "admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" aria-label={`Delete user ${user.name}`}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
