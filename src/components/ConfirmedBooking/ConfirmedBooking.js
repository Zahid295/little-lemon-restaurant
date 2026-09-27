import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCsrfToken } from "../../context/AuthContext";
import "./ConfirmedBooking.css";

export default function ConfirmedBooking() {
  const { confirmationCode } = useParams();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadReservation() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reservations/${confirmationCode}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Reservation not found.");
        if (isCurrent) setReservation(data);
      } catch (loadError) {
        if (isCurrent) setError(loadError.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadReservation();
    return () => {
      isCurrent = false;
    };
  }, [confirmationCode]);

  async function cancelReservation() {
    if (!window.confirm("Cancel this reservation?")) return;

    setIsCancelling(true);
    setError("");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservations/${confirmationCode}/cancel`,
        {
          method: "POST",
          headers: { "X-CSRFToken": getCsrfToken() },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to cancel reservation.");
      setReservation(data);
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return <section className="confirmed-booking">Loading reservation...</section>;
  }

  if (!reservation) {
    return (
      <section className="confirmed-booking">
        <h1>Reservation not found</h1>
        <p>{error}</p>
        <Link to="/reservations">Make a reservation</Link>
      </section>
    );
  }

  return (
    <section className="confirmed-booking">
      <h1>{reservation.status === "confirmed" ? "Your reservation is confirmed" : "Reservation cancelled"}</h1>
      <p>{reservation.customer_name}, your table for {reservation.guests} is {reservation.status}.</p>
      <p>{reservation.reservation_date} at {reservation.reservation_time}</p>
      <p>Confirmation code: {reservation.confirmation_code}</p>
      {error && <p role="alert">{error}</p>}
      {reservation.status === "confirmed" && (
        <button type="button" onClick={cancelReservation} disabled={isCancelling}>
          {isCancelling ? "Cancelling..." : "Cancel reservation"}
        </button>
      )}
      <Link to="/reservations">Make another reservation</Link>
    </section>
  );
}
