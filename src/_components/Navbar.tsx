"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  PhoneIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Searchbar from "./Searchbar";
import { useThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useThemeContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("ecom-token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecom-token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-gray-900 shadow-md sticky z-50 top-0 flex font-bold font-poppins items-center justify-between transition-colors duration-300 text-primary dark:text-green-300">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <FiShoppingBag className="text-green-500 dark:text-green-300 text-3xl" />
        <h1 className="text-3xl font-bold font-logo">HAMRO MART</h1>
      </Link>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 mx-6">
        <Searchbar />
      </div>

      {/* Desktop Menu Items */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-1 text-sm">
          <PhoneIcon className="h-6 w-6" strokeWidth={2} />
          <span className="text-gray-600 dark:text-white">9814149723</span>
        </div>

        <Link href="/cart">
          <ShoppingCartIcon
            className="h-6 w-6 hover:text-green-500 dark:hover:text-green-400 cursor-pointer"
            strokeWidth={2}
          />
        </Link>

        {isLoggedIn ? (
          <div
            className="relative"
            onMouseEnter={() => setShowLogoutTooltip(true)}
            onMouseLeave={() => setShowLogoutTooltip(false)}
          >
            <UserIcon
              onClick={handleLogout}
              className="h-6 w-6 hover:text-green-500 dark:hover:text-green-400 cursor-pointer"
              strokeWidth={2}
              title="Log out"
            />
            {showLogoutTooltip && (
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                Log out
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="hover:text-green-500 dark:hover:text-green-400 font-semibold cursor-pointer"
          >
            Login
          </Link>
        )}

        <button onClick={toggleTheme} className="focus:outline-none">
          {darkMode ? (
            <SunIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <MoonIcon className="h-6 w-6" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-primary dark:text-green-300 focus:outline-none"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <Bars3Icon className="h-8 w-8" />
        )}
      </button>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-6 text-primary dark:text-green-300">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:text-green-500 dark:hover:text-green-400 focus:outline-none"
            >
              <UserIcon className="h-6 w-6" strokeWidth={2} />
              <span>Log out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="hover:text-green-500 dark:hover:text-green-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center space-x-2 hover:text-green-500 dark:hover:text-green-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCartIcon className="h-6 w-6" strokeWidth={2} />
            <span>Cart</span>
          </Link>

          <div className="flex items-center space-x-2 text-sm">
            <PhoneIcon className="h-6 w-6" strokeWidth={2} />
            <span className="text-gray-600 dark:text-white">9814149723</span>
          </div>

          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {darkMode ? (
              <>
                <SunIcon className="h-6 w-6" strokeWidth={2} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-6 w-6" strokeWidth={2} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
