// CartContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem } from "../interface/CartItem";
import axios from "axios";



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
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
  }, []);
  
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // const addToCart = (item: CartItem) => {
  //   setCartItems((prevItems) => {
  //     const existingItemIndex = prevItems.findIndex(i => i.bookId === item.bookId);
  
  //     if (existingItemIndex !== -1) {
  //       // Nếu đã có trong giỏ, chỉ cập nhật số lượng
  //       const updatedItems = [...prevItems];
  //       updatedItems[existingItemIndex].quantity += item.quantity;
  //       return updatedItems;
  //     } else {
  //       // Thêm item mới lên ĐẦU danh sách
  //       return [item, ...prevItems];
  //     }
  //   });
  // };

  const addToCart = async (item: CartItem) => {
    if (user) {
      // Nếu đã đăng nhập → gọi API Redis
      try {
        const token = localStorage.getItem("token");

        await axios.post(`http://localhost:8080/api/cart/add?userId=${user.userId}`, item, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Lấy lại giỏ hàng sau khi thêm thành công
        const res = await axios.get(`http://localhost:8080/api/cart`, {
          params: { userId: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const addedBookId = item.bookId;

        // Đưa item mới lên đầu danh sách
        const sortedItems = [
          ...res.data.filter((i: CartItem) => i.bookId === addedBookId),
          ...res.data.filter((i: CartItem) => i.bookId !== addedBookId),
        ];

        setCartItems(sortedItems);

      } catch (error) {
        console.error("Lỗi khi thêm giỏ hàng Redis:", error);
      }
    } else {
      // Nếu chưa đăng nhập → lưu localStorage như cũ
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(i => i.bookId === item.bookId);

        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          const existingItem = updatedItems[existingItemIndex];

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity
          };

          return updatedItems;
        } else {
          return [item, ...prevItems];
        }
      });
    }
  };

  // const updateQuantity = (bookId: number, quantity: number) => {
  //   setCartItems(prev =>
  //     prev.map(item =>
  //       item.bookId === bookId
  //         ? { ...item, quantity: Math.min(quantity, item.stock) }
  //         : item
  //     )
  //   );
  // };

  const updateQuantity = async (bookId: number, quantity: number) => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:8080/api/cart/update`, 
          null, 
          {
            params: {
              userId: user.userId,
              bookId,
              quantity,
            },
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        // Lấy lại giỏ hàng sau khi cập nhật thành công
        const res = await axios.get(`http://localhost:8080/api/cart`, {
          params: { userId: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);

      } catch (error) {
        console.error("Lỗi cập nhật Redis:", error);
      }
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.bookId === bookId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      );
    }
  };

  // const removeFromCart = (bookId: number) => {
  //   setCartItems(prev => prev.filter(item => item.bookId !== bookId));
  // };

  const removeFromCart = async (bookId: number) => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/cart/remove`, {
        params: {
          userId: user.userId,
          bookId,
        },
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
       // Lấy lại giỏ hàng sau khi xóa thành công
      const res = await axios.get(`http://localhost:8080/api/cart`, {
        params: { userId: user.userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);

      } catch (error) {
        console.error("Lỗi xóa Redis:", error);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.bookId !== bookId));
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const token = localStorage.getItem("token");
        console.log("token của get cart: ", token);
        try {
          const res = await axios.get(`http://localhost:8080/api/cart`, {
            params: { userId: user.userId },
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          setCartItems(res.data);
        } catch (err) {
          console.error("Không thể load giỏ hàng từ Redis", err);
          setCartItems([]);
        }
      } else {
        setCartItems(loadCartFromLocalStorage());
      }
    };

    fetchCart(); // ← GỌI NGAY KHI user thay đổi (có hoặc không)
  }, [user]);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(CART_EXPIRY_KEY, Date.now().toString()); // lưu timestamp
  };

  const removeMultipleFromCart = async (bookIds: number[]) => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        // Gọi API xóa nhiều sản phẩm trong giỏ hàng server (DELETE + body)
        await axios.delete(`http://localhost:8080/api/cart/remove-multiple`, {
          params: { userId: user.userId },
          headers: { Authorization: `Bearer ${token}` },
          data: bookIds, // body gửi danh sách bookIds
        });

        // Lấy lại giỏ hàng mới nhất từ server
        const res = await axios.get(`http://localhost:8080/api/cart`, {
          params: { userId: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (error) {
        console.error("Lỗi khi xóa nhiều sản phẩm Redis:", error);
      }
    } else {
      // Xóa local
      setCartItems(prev => prev.filter(item => !bookIds.includes(item.bookId)));
    }
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