"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TrashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type User = {
  id: number;
  email: string;
  role: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("User deleted!"); fetchUsers(); }
    else { toast.error("Failed to delete"); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-gray-500 animate-pulse">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>

      <div className="overflow-x-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden min-w-[320px]">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition duration-150 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-6 py-4 font-medium text-gray-800">{i + 1}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
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
