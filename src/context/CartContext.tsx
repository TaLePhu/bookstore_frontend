// CartContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem } from "../interface/CartItem";

const CART_STORAGE_KEY = "cartItems";
const CART_EXPIRY_KEY = "cartExpiry";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  getTotalItems: () => number;
  saveCartToLocalStorage: (items: CartItem[]) => void;
  loadCartFromLocalStorage: () => CartItem[];
  removeMultipleFromCart: (bookIds: number[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const loadCartFromLocalStorage = (): CartItem[] => {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  const expiry = localStorage.getItem(CART_EXPIRY_KEY);
  const now = Date.now();

  if (stored && expiry && now <= parseInt(expiry) + 5 * 24 * 60 * 60 * 1000) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }

  // Nếu quá 5 ngày thì xóa luôn
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CART_EXPIRY_KEY);
  return [];
};


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromLocalStorage());
  
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(i => i.bookId === item.bookId);
  
      if (existingItemIndex !== -1) {
        // Nếu đã có trong giỏ, chỉ cập nhật số lượng
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Thêm item mới lên ĐẦU danh sách
        return [item, ...prevItems];
      }
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

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(CART_EXPIRY_KEY, Date.now().toString()); // lưu timestamp
  };

  const removeMultipleFromCart = (bookIds: number[]) => {
    setCartItems(prev => prev.filter(item => !bookIds.includes(item.bookId)));
  };

  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems, saveCartToLocalStorage, loadCartFromLocalStorage, removeMultipleFromCart }}>
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