import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // ✅ استرجاع cart عند بداية التطبيق
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // ✅ حفظ التغييرات فـ localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) return prev;
      return [...prev, { ...product, quantity, stock: product.stock }];

    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

const updateQuantity = (id, amount) => {
  const item = cart.find((p) => p._id === id);

  if (!item) return;

  if (amount > item.stock) {
    alert("🚫 Quantity exceeds available stock");
    return;
  }

  if (amount < 1) return; // optional: منع الكمية أقل من 1

  const updated = cart.map((p) =>
    p._id === id ? { ...p, quantity: amount } : p
  );

  setCart(updated);
};



  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}
