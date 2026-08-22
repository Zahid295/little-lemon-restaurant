import { useLocation, Link } from "react-router-dom";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const { state } = useLocation();

  if (!state) {
    return (
      <section className="confirmation-page">
        <h1 className="confirmation-title">Order Not Found</h1>
        <p className="confirmation-subtitle">
          It looks like you navigated here without placing an order.
        </p>
        <Link to="/order-online" className="home-btn">
          Continue Ordering
        </Link>
      </section>
    );
  }

  const { customer, cart } = state;

  const total = cart.reduce((sum, item) => {
    const numericPrice = Number(item.price.replace("$", ""));
    return sum + numericPrice * item.quantity;
  }, 0);

  const eta =
    customer.orderType === "pickup"
      ? "Ready in 15 minutes"
      : "Delivered in 30-45 minutes";

  return (
    <section className="confirmation-page">
      <div className="confirmation-header">
        <h1 className="confirmation-title">Order Confirmed</h1>
        <p className="confirmation-subtitle">
          Thank you, {customer.name}. Your order has been successfully placed.
        </p>
      </div>

      <div className="confirmation-flex">
        <div className="confirmation-card">
          <h2 className="section-heading">Order Details</h2>

          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Order Type:</strong> {customer.orderType}</p>

          {customer.orderType === "delivery" && (
            <>
              <p><strong>Street:</strong> {customer.street}</p>
              <p><strong>City:</strong> {customer.city}</p>
              <p><strong>Postcode:</strong> {customer.postcode}</p>
            </>
          )}
        </div>

        <div className="confirmation-card">
          <h2 className="section-heading">Items</h2>

          <div className="items-list">
            {cart.map((item) => {
              const numericPrice = Number(item.price.replace("$", ""));
              return (
                <div className="item-row" key={item.title}>
                  <span className="item-title">{item.title}</span>
                  <span className="item-qty">x {item.quantity}</span>
                  <span className="item-price">
                    €{(numericPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
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

