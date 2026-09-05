"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { UserCircleIcon, EnvelopeIcon, KeyIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    if (!token) { router.push("/login"); return; }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      userId = payload.id;
    } catch { router.push("/login"); return; }

    fetch(`/api/users`)
      .then((r) => r.json())
      .then((users) => {
        const u = users.find((u: { id: number }) => u.id === userId);
        if (u) { setUser(u); setName(u.name); setEmail(u.email); }
        setLoading(false);
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSaving(true);
    const body: Record<string, string> = { name, email };
    if (newPassword) body.password = newPassword;

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success("Profile updated!");
      setNewPassword("");
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="section-title mb-8">Account Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>

            <div>
              <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="settings-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field !pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field !pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>Role: <span className="font-medium capitalize">{user?.role}</span></span>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Leave blank to keep your current password.</p>

            <div>
              <label htmlFor="settings-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="settings-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="input-field !pl-10" minLength={6} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
