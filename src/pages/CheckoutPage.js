import { useState } from "react";
import { useCart } from "../context/CartContext";
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        navigate("/order-confirmation", {
          state: {
            customer: form,
            cart,
          },
        });
    };

    const total = cart.reduce((sum, item) => {
        const numericPrice = Number(item.price.replace("$", ""));
        return sum + numericPrice * item.quantity;
    }, 0)

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
          {cart.map((item) => {
            const numericPrice = Number(item.price.replace("$", ""));
            return (
              <p key={item.title}>
                {item.title} x {item.quantity} - $
                {(numericPrice * item.quantity).toFixed(2)}
              </p>
            );
          })}

          <h3 className="summary-total">Total: €{total.toFixed(2)}</h3>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </div>

    </div>
  </form>
</section>
    );
}