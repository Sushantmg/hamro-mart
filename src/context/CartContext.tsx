"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export type Product = {
  id: number | string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  quantity?: number;
  [key: string]: any | unknown;
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (!existing) return prevCart;
      if ((existing.quantity ?? 1) === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity ?? 1) - 1 }
          : item
      );
    });
  };

  const clearCart = () => setCart([]);

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
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
