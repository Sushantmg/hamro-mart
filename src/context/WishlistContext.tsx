"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type WishlistItem = {
  id: number;
  userId: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    category: string;
    image: string;
    desc: string;
    price: number;
    discount: number;
  };
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  loading: boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refresh: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

function getUserId(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/ecom-token=user-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await res.json();
      setWishlist(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId: number) => wishlist.some((w) => w.productId === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: number) => {
      const userId = getUserId();
      if (!userId) return;

      if (isInWishlist(productId)) {
        const item = wishlist.find((w) => w.productId === productId);
        if (item) {
          await fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
          setWishlist((prev) => prev.filter((w) => w.productId !== productId));
        }
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        fetchWishlist();
      }
    },
    [wishlist, isInWishlist, fetchWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isInWishlist, refresh: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
