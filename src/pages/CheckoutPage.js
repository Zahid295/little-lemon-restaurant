import { useState } from "react";
import { useCart } from "../context/CartContext";
import { getCsrfToken } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage() {
    const { cart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        orderType: "pickup",
        street: "",
        city: "",
        postcode: "",
    });

    const [errors, setErrors] = useState({});
    const [submissionError, setSubmissionError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";

        if (form.orderType === "delivery") {
            if (!form.street.trim()) newErrors.street = "Street is required";
            if (!form.city.trim()) newErrors.city = "City is required";
            if (!form.postcode.trim()) newErrors.postcode = "Postcode is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

      setSubmissionError("");
      setIsSubmitting(true);

      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          credentials: "include",
          body: JSON.stringify({
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            order_type: form.orderType,
            street: form.street,
            city: form.city,
            postcode: form.postcode,
          }),
        });

        const responseData = await res.json();
        if (!res.ok) {
          const firstFieldError = Object.values(responseData).flat()[0];
          throw new Error(
            responseData.detail || responseData.message || firstFieldError || "Failed to place order. Please try again."
          );
        }

        navigate(`/order-confirmation/${responseData.id}`);
      } catch (error) {
        setSubmissionError(error.message || "Unable to place your order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
  }

    const total = cart.reduce((sum, item) => {
      return sum + Number(item.price);
  }, 0);

    return (
<section className="checkout-page">
  <Link to="/cart" className="back-to-cart-top">
    Back to Cart
  </Link>

  <h1 className="checkout-title">Checkout</h1>

  <form className="checkout-form" onSubmit={handleSubmit}>
    <div className="checkout-columns">

      <div className="checkout-left">
        <h2 className="section-heading">Customer Information</h2>

        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </label>

        <label>
          Phone
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </label>

        <h2 className="section-heading">Order Type</h2>

        <div className="order-type">
          <label>
            <input type="radio" name="orderType" value="pickup"
              checked={form.orderType === "pickup"} onChange={handleChange} />
            Pickup
          </label>

          <label>
            <input type="radio" name="orderType" value="delivery"
              checked={form.orderType === "delivery"} onChange={handleChange} />
            Delivery
          </label>
        </div>

        {form.orderType === "delivery" && (
          <>
            <h2 className="section-heading">Delivery Address</h2>

            <label>
              Street
              <input type="text" name="street" value={form.street} onChange={handleChange} />
              {errors.street && <p className="error">{errors.street}</p>}
            </label>

            <label>
              City
              <input type="text" name="city" value={form.city} onChange={handleChange} />
              {errors.city && <p className="error">{errors.city}</p>}
            </label>

            <label>
              Postcode
              <input type="text" name="postcode" value={form.postcode} onChange={handleChange} />
              {errors.postcode && <p className="error">{errors.postcode}</p>}
            </label>
          </>
        )}
      </div>

      <div className="checkout-right">
        <h2 className="section-heading">Order Summary</h2>

        <div className="summary-box">
          {cart.map((item) => (
                <p key={item.id}>
                  {item.menuitem.title} x {item.quantity} — €{item.price}
                </p>
          ))}

          <h3 className="summary-total">Total: €{total.toFixed(2)}</h3>
        </div>

        <button type="submit" className="place-order-btn">
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
        {submissionError && <p className="error" role="alert">{submissionError}</p>}
      </div>

    </div>
  </form>
</section>
    );
}