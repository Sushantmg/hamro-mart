'use client';

import React, { useEffect, useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

type User = {
  id: number;
  email: string;
  password: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:3007/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">👥 Manage Users</h1>

      <div className="overflow-x-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden min-w-[320px]">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                    {i + 1}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2 max-w-[220px] truncate">
                    <EnvelopeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                    <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2 whitespace-nowrap">
                    <span className="text-gray-500 font-mono block min-w-[90px]">
                      {showPasswords[user.id] ? user.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePassword(user.id)}
                      className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                      title={showPasswords[user.id] ? 'Hide Password' : 'Show Password'}
                      aria-label={showPasswords[user.id] ? 'Hide Password' : 'Show Password'}
                    >
                      {showPasswords[user.id] ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
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
