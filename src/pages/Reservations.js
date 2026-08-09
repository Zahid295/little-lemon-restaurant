import { useReducer } from "react";
import BookingForm from "../components/BookingForm/BookingForm";
import BookingSlotList from "../components/BookingSlotList/BookingSlotList";
import "./Reservations.css";

function initializeTimes() {
    const today = new Date()
  return {
    /* global fetchAPI */
    available: fetchAPI(today)
  }
}

function updateTimes(state, action) {
    if (action.type === "update-date") {
        const SelectedDate = new Date(action.date)
        return {
            ...state,
            available: fetchAPI(SelectedDate)
        };
    }
    return state
}

export default function Reservations({ submitForm }) {
    const [state, dispatch] = useReducer(updateTimes, initializeTimes());

    return (
        <section 
        className="reservations-page"
        aria-labelledby="reservations-heading"
        >
            <h1 id="reservations-heading">Reserve a Table</h1>
            <p>Please fill in the form below to complete your reservation.</p>

            <BookingForm availableTimes={state.available} dispatch={dispatch} submitForm={submitForm} />
            <BookingSlotList availableTimes={state.available} />
        </section>
    );
}

export { initializeTimes, updateTimes };