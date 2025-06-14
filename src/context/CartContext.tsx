"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

// Type for each product in the cart
export type Product = {
  id: number | string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity?: number;
  [key: string]: any; // Allow additional properties
};

// Type for the context shape
type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

// Create context with undefined initial value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Cart Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Add product to cart (or increase quantity if it already exists)
  const addToCart = (product: Product): void => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove one unit of a product from cart (or remove product if quantity becomes 0)
  const removeFromCart = (productId: number | string): void => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (!existing) return prevCart;
      if ((existing.quantity || 1) === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      );
    });
  };

  // Clear entire cart
  const clearCart = (): void => {
    setCart([]);
  };

  // Calculate total items in cart
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cart]
  );

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.discountedPrice ?? item.price;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
