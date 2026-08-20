import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
    const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price.replace("$", "")) * item.quantity, 0
    );

    return (
        <section className="cart-page">
            <h1 className="cart-title">Your Cart</h1>

            {cart.length === 0 && (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/order-online" className="back-btn">
                    Continue Ordering
                    </Link>
                </div>
            )}
            {cart.map(item => (
                <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-img" />

                    <div className="cart-details">
                        <h3>{item.title}</h3>
                        <p className="cart-price">
                            ${(Number(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                        </p>

                        <div className="cart-qty-controls">
                            <button 
                            onClick={() => decreaseQty(item.id)}
                            className="qty-btn"
                            >
                            -
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button 
                            onClick={() => increaseQty(item.id)}
                            className="qty-btn"
                            >
                            +
                            </button>

                            <button 
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                            >
                            Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {cart.length > 0 && (
                <div className="cart-footer">
                    <h2>Total: €{total.toFixed(2)}</h2>

                    <Link to="/checkout" className="checkout-btn">
                    Proceed to checkout
                    </Link>

                    <Link to="/order-online" className="back-btn">
                    Continue Ordering
                    </Link>
                </div>
            )}
        </section>
    );
}