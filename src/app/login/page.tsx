"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("login form failed")
        return;
      }

      // Save token in cookie
      Cookies.set("ecom-token", data.token, { expires: 7 });
      console.log("login successfull")
      router.push(data.token === "admin" ? "/admin" : "/");
    } catch {
      console.log("login error")
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-green-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=green&shade=600"
            width={40}
            height={40}
            className="mx-auto"
          />
        </Link>

        <h2 className="mt-10 text-center text-3xl font-bold text-green-500 dark:text-green-300">
          {isLoggedIn ? "You are already logged in" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          <form
            onSubmit={handleLogin}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={!email || !password}
                className={`w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-300 ${
                  !email || !password ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {!isLoggedIn && (
          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Not a member?{" "}
            <Link href="/register" className="text-blue-700">
              Start a 14-day free trial
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
