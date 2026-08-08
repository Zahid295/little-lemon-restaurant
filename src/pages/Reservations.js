import { useReducer } from "react";
import BookingForm from "../components/BookingForm/BookingForm";
import BookingSlotList from "../components/BookingSlotList/BookingSlotList";
import "./Reservations.css";

function initializeTimes() {
    const today = new Date()
  return {
    available: fetchAPI(today),
    booked: {}
  }
}

function updateTimes(state, action) {
    if (action.type === "update-date") {
        const SelectedDate = new Date(action.date)
        // const date = action.date;
        // const allSlots = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        // const bookedForDate = state.booked[date] || [];

        // const available = allSlots.filter((slot) => !bookedForDate.includes(slot));
        return {
            ...state,
            available: fetchAPI(SelectedDate)
        };
    }
    
    if (action.type === "book-slot") {
        const { date, time } = action;

        const bookedForDate = state.booked[date] || [];
        return {
            ...state,
            booked: {
                ...state.booked,
                [date]: [...bookedForDate, time]
            }
        };
    }
    return state
}

export default function Reservations() {
    const [state, dispatch] = useReducer(updateTimes, initializeTimes());

    return (
        <section 
        className="reservations-page"
        aria-labelledby="reservations-heading"
        >
            <h1 id="reservations-heading">Reserve a Table</h1>
            <p>Please fill in the form below to complete your reservation.</p>

            <BookingForm availableTimes={state.available} dispatch={dispatch} />
            <BookingSlotList availableTimes={state.available} />
        </section>
    );
}

export { initializeTimes, updateTimes };