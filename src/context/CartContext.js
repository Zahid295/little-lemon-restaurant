import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { accessToken } = useAuth();
  const [cart, setCart] = useState([]);

  async function loadCart() {
    if (!accessToken) return;

    const res = await fetch("http://127.0.0.1:8000/api/cart/menu-items", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    setCart(data);
  }

  async function addToCart(item, quantity = 1) {
    await fetch("http://127.0.0.1:8000/api/cart/menu-items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        menuitem: item.id,
        quantity,
      }),
    });

    loadCart();
  }

  async function increaseQty(menuitemId) {
    const item = cart.find((i) => i.menuitem.id === menuitemId);
    if (!item) return;

    await addToCart({ id: menuitemId }, item.quantity + 1);
  }

  async function decreaseQty(menuitemId) {
    const item = cart.find((i) => i.menuitem.id === menuitemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity - 1);
    await addToCart({ id: menuitemId }, newQty);
  }

  async function removeFromCart(menuitemId) {
    await fetch(`http://127.0.0.1:8000/api/cart/menu-items/${menuitemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    loadCart();
  }

  async function clearCart() {
    await fetch("http://127.0.0.1:8000/api/cart/menu-items", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    loadCart();
  }

  useEffect(() => {
    loadCart();
  }, [accessToken, loadCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
