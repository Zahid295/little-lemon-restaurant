import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(1);
    const [occasion, setOccasion] = useState("Birthday");

    const [availableTimes] = useState([
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
    ])


function handleSubmit(e) {
    e.preventDefault();
    console.log({ date, time, guests, occasion });
}

return (
    <form className="booking-form" onSubmit={handleSubmit}>
        <label htmlFor="res-date">Choose date</label>
        <input
        type="date"
        id="res-date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        />

        <label htmlFor="res-time">Choose time</label>
        <select 
        id="res-time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        >
            {availableTimes.map((t) => (
                <option key={t}>{t}</option>
                ))}
        </select>

        <label htmlFor="guests">Number of guests</label>
        <input 
        type="Number"
        id="guests"
        min="1"
        max="10"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        required
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