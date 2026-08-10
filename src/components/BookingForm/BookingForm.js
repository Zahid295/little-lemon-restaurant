import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm({ availableTimes, dispatch, submitForm }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(1);
    const [occasion, setOccasion] = useState("Birthday");


  function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      date,
      time,
      guests,
      occasion
    };

    submitForm(formData);
  }

return (
    <form 
    className="booking-form"
    aria-labelledby="reservations-heading"
    onSubmit={handleSubmit}
    >
        <label htmlFor="res-date">Choose date</label>
        <input
        type="date"
        id="res-date"
        value={date}
        onChange={(e) => {
            setDate(e.target.value);
            dispatch({ type: "update-date", payload: new Date(e.target.value) })
        }}
        required
        aria-required="true"
        />

        <label htmlFor="res-time" data-testid = "choose-time-label">Choose time</label>
        <select 
        id="res-time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        aria-required="true"
        >
            {availableTimes.map((t) => (
                <option key={t}>{t}</option>
                ))}
        </select>

        <label htmlFor="guests" data-testid = "guests-label">Number of guests</label>
        <input 
        type="Number"
        id="guests"
        min="1"
        max="10"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        required
        aria-required="true"
        />

        <label htmlFor="occasion">Occasion</label>
        <select id="occasion"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}>
            <option>Birthday</option>
            <option>Anniversary</option>
        </select>

        <input type="submit" value="Make your Reservation" />
    </form>
)
}