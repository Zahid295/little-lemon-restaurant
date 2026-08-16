import specials from "../data/specials";
import SpecialsCard from "../components/Highlights/SpecialsCard";
import { useCart } from "../context/CartContext";
import "./OrderOnlinePage.css";

export default function OrderOnline() {
    const { addToCart } = useCart();

    return (
        <section className="order-page">
            <h1 className="order-title">Order Online</h1>
            <p className="order-subtitle">Choose items below to start your order</p>

            <div className="order-items">
                {specials.map((item, index) => (
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