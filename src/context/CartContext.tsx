"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type CartProduct = {
  id: number | string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  quantity?: number;
  image?: string;
  category?: string;
};

type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: CartProduct, qty?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hamro-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("hamro-cart", JSON.stringify(cart));
  }, [cart, loaded]);

  const addToCart = (product: CartProduct, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("hamro-cart");
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [cart]
  );

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.discountedPrice ?? item.price;
      return sum + price * (item.quantity ?? 1);
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
