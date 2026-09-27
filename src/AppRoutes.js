import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MenuPage from "./pages/MenuPage";
import Reservations from "./pages/Reservations";
import ConfirmedBooking from "./components/ConfirmedBooking/ConfirmedBooking";
import OrderOnlinePage from "./pages/OrderOnlinePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route
        path="/reservations"
        element={<Reservations />}
      />
      <Route path="/confirmed/:confirmationCode" element={<ConfirmedBooking />} />
      <Route path="/order-online" element={<OrderOnlinePage />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/login" element={<LoginPage />}/>
    </Routes>
  );
}
