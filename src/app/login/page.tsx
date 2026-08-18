"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }

      Cookies.set("ecom-token", data.token, { expires: 7 });
      toast.success("Welcome back!");
      router.push(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("ecom-token");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    toast.success("Logged out!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoggedIn ? "Welcome back" : "Sign in to HamroMart"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isLoggedIn ? "You're already signed in" : "Fresh groceries waiting for you"}
          </p>
        </div>

        <div className="card p-8">
          {isLoggedIn ? (
            <div className="text-center space-y-4">
              <button onClick={handleLogout} className="btn-danger w-full">
                Sign Out
              </button>
              <Link href="/" className="block text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Go to Homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="input-field !pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="btn-primary w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-xs text-gray-500 dark:text-gray-400">
                <p className="font-medium mb-1">Demo credentials:</p>
                <p>Admin: admin@hamromart.com / admin123</p>
                <p>User: sus@gmail.com / 1234</p>
              </div>
            </form>
          )}
        </div>

        {!isLoggedIn && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Create one
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
