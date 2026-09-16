import { useEffect, useState } from "react";
import SpecialsCard from "../components/Highlights/SpecialsCard";
import { useCart } from "../context/CartContext";
import "./OrderOnlinePage.css";

export default function OrderOnline() {
    const { addToCart } = useCart();
    const [items, setItems] = useState([]);

    useEffect(() => {
     async function load() {
       const res = await fetch("http://127.0.0.1:8000/api/menu-items");
       const data = await res.json();
       setItems(data);
     }
     load();
    }, []);

    return (
        <section className="order-page">
            <h1 className="order-title">Order Online</h1>
            <p className="order-subtitle">Choose items below to start your order</p>

            <div className="order-items">
                {items.map((item, index) => (
                    <SpecialsCard 
                    key={index} 
                    item={item}
                    addToCart={addToCart} 
                    showAddToCart={true} 
                    showOrderLink={false} 
                    />
                ))}
            </div>
        </section>
    )
}