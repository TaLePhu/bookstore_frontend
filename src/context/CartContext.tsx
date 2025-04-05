// CartContext.tsx
import React, { createContext, useState, useContext } from "react";
import { CartItem } from "../interface/CartItem";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.bookId === item.bookId);
      if (existing) {
        return prev.map(p =>
          p.bookId === item.bookId
            ? { ...p, quantity: Math.min(p.quantity + item.quantity, item.stock) }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.bookId === bookId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const removeFromCart = (bookId: number) => {
    setCartItems(prev => prev.filter(item => item.bookId !== bookId));
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }

//   const { cartItems, addToCart } = context;

  

//   return { cartItems, addToCart, getTotalItems };
// };