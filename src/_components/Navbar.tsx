"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  ShoppingCartIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useThemeContext } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { darkMode, toggleTheme } = useThemeContext();
  const { totalItems } = useCart();
  const [token, setToken] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(() => {
    const t = Cookies.get("ecom-token") || null;
    setToken(t);
  }, []);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [checkAuth, pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!token;
  const isAdmin = token === "admin" || token?.startsWith("eyJ") && (() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      return payload.role === "admin";
    } catch { return false; }
  })();
  const isUser = isLoggedIn && !isAdmin;

  const handleLogout = () => {
    Cookies.remove("ecom-token");
    setToken(null);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const isAdminPath = pathname.startsWith("/admin");

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Hamro<span className="text-emerald-600">Mart</span>
              </span>
            </Link>

            {/* Desktop Search */}
            {!isAdminPath && (
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fresh fruits, vegetables..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
              {isUser && (
                <Link href="/wishlist" className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all" title="Wishlist">
                  <HeartIcon className="h-5 w-5" />
                </Link>
              )}

              <Link href="/cart" className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all" title="Cart">
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all text-sm font-medium">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {isUser && (
                <Link href="/profile" className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all" title="Profile">
                  <UserCircleIcon className="h-5 w-5" />
                </Link>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              ) : (
                <Link href="/login" className="btn-primary !py-2 !px-4 text-sm">
                  Sign in
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-950 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Menu
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Mobile Search */}
          {!isAdminPath && (
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field !py-2.5 !text-sm"
                />
                <MagnifyingGlassIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {isUser && (
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </Link>
            )}

            {isUser && (
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <HeartIcon className="h-5 w-5" />
                Wishlist
              </Link>
            )}

            {isUser && (
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <ShoppingCartIcon className="h-5 w-5" />
                Orders
              </Link>
            )}

            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <ShoppingCartIcon className="h-5 w-5" />
              Cart {totalItems > 0 && <span className="ml-auto text-sm font-medium text-emerald-600">{totalItems} items</span>}
            </Link>

            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all font-medium">
                <ShieldCheckIcon className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <button
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
