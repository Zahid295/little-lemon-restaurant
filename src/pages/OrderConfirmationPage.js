import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { isLoading: isAuthLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading) return undefined;

    let isCurrent = true;

    async function loadOrder() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Unable to load this order.");
        const savedOrder = await response.json();
        if (isCurrent) setOrder(savedOrder);
      } catch (loadError) {
        if (isCurrent) setError(loadError.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadOrder();
    return () => {
      isCurrent = false;
    };
  }, [isAuthLoading, orderId]);

  if (isAuthLoading || isLoading) {
    return <section className="confirmation-page">Loading order...</section>;
  }

  if (error || !order) {
    return (
      <section className="confirmation-page">
        <h1 className="confirmation-title">Order Not Found</h1>
        <p className="confirmation-subtitle">
          {error || "This order could not be found."}
        </p>
        <Link to="/order-online" className="home-btn">
          Continue Ordering
        </Link>
      </section>
    );
  }

  const total = Number(order.total);

  const eta =
    order.order_type === "pickup"
      ? "Ready in 15 minutes"
      : "Delivered in 30-45 minutes";

  return (
    <section className="confirmation-page">
      <div className="confirmation-header">
        <h1 className="confirmation-title">Order Confirmed</h1>
        <p className="confirmation-subtitle">
          Thank you, {order.customer_name}. Your order has been successfully placed.
        </p>
      </div>

      <div className="confirmation-flex">

        <div className="confirmation-card">
          <h2 className="section-heading">Order Details</h2>

          <p><strong>Name:</strong> {order.customer_name}</p>
          <p><strong>Email:</strong> {order.customer_email}</p>
          <p><strong>Phone:</strong> {order.customer_phone}</p>
          <p><strong>Order Type:</strong> {order.order_type}</p>

          {order.order_type === "delivery" && (
            <>
              <p><strong>Street:</strong> {order.street}</p>
              <p><strong>City:</strong> {order.city}</p>
              <p><strong>Postcode:</strong> {order.postcode}</p>
            </>
          )}

          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {order.date}</p>
        </div>

        <div className="confirmation-card">
          <h2 className="section-heading">Items</h2>

          <div className="items-list">
            {order.order_items.map((item) => (
              <div className="item-row" key={item.id}>
                <span className="item-title">{item.menuitem.title}</span>
                <span className="item-qty">x {item.quantity}</span>
                <span className="item-price">€{item.price}</span>
              </div>
            ))}
          </div>

          <div className="total-row">
            <span className="total-label">Total:</span>
            <span className="total-value">€{total.toFixed(2)}</span>
          </div>

          <p className="eta">{eta}</p>
        </div>
      </div>

      <Link to="/order-online" className="home-btn">
        Continue Ordering
      </Link>
    </section>
  );
}


