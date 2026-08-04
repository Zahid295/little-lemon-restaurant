import BookingForm from "../components/BookingForm/BookingForm";
import "./Reservations.css";

export default function Reservations() {
    return (
        <section className="reservations-page">
            <h1>Reserve a Table</h1>
            <p>Please fill in the form below to complete your reservation.</p>

            <BookingForm />
        </section>
    );
}