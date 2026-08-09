/* global submitAPI */
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";
import ConfirmedBooking from "./components/ConfirmedBooking/ConfirmedBooking";

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
      <Route
        path="/reservations"
        element={<Reservations submitForm={submitForm} />}
      />
      <Route path="/confirmed" element={<ConfirmedBooking />} />
    </Routes>
  );
}
