/* global submitAPI */
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MenuPage from "./pages/MenuPage";
import Reservations from "./pages/Reservations";
import ConfirmedBooking from "./components/ConfirmedBooking/ConfirmedBooking";
import OrderOnlinePage from "./pages/OrderOnlinePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";


export default function AppRoutes() {
  const navigate = useNavigate();

  function submitForm(formData) {
    const success = submitAPI(formData);
    if (success) {
      navigate("/confirmed");
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route
        path="/reservations"
        element={<Reservations submitForm={submitForm} />}
      />
      <Route path="/confirmed" element={<ConfirmedBooking />} />
      <Route path="/order-online" element={<OrderOnlinePage />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
    </Routes>
  );
}
