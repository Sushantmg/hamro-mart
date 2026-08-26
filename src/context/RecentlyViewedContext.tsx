"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  discountedPrice: number | null;
  image: string;
  category: string;
}

const STORAGE_KEY = "hamro-recently-viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {}
  }, []);

  const addProduct = useCallback((product: Product) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  }, []);

  return { recent, addProduct, clearRecent };
}
