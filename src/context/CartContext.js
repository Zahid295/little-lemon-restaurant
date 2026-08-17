import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(item, quantity) {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + quantity}: i
                );
            }
            return [...prev, {...item, quantity}]
        });
    }

    function removeFromCart(id) {
        setCart(prev => prev.filter(item => item.id !== id));
    }

    function clearCart() {
        setCart([]);
    }

    function increaseQty(id) {
        setCart(prev =>
            prev.map(item =>
            item.id === id ? {...item, quantity: item.quantity + 1} : item
        )
      );
    }

    function decreaseQty(id) {
        setCart(prev =>
            prev.map(item =>
                item.id === id ? {...item, quantity: Math.max(1, item.quantity - 1)} : item
            )
        );
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQty, decreaseQty }}>
            {children}
            {console.log("CART STATE:", cart)}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext);
}