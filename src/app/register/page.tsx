"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to register");
        return;
      }

      toast.success("Signup successful");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-green-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
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

        <h2 className="mt-10 text-center text-3xl font-bold text-green-600 dark:text-green-300">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleRegister}
          className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
        >
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* EMAIL */}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* PASSWORD */}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={!name || !email || !password}
              className={`w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-600 ${
                !name || !email || !password
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
