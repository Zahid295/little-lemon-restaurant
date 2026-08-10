import { useReducer } from "react";
import BookingForm from "../components/BookingForm/BookingForm";
import BookingSlotList from "../components/BookingSlotList/BookingSlotList";
import "./Reservations.css";

/* global fetchAPI */
function initializeTimes() {
    const today = new Date();
    return fetchAPI(today);
}

function updateTimes(state, action) {
    if (action.type === "update-times") {
        return fetchAPI(action.payload);
    }
    return state;
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

            <BookingForm availableTimes={state} dispatch={dispatch} submitForm={submitForm} />
            <BookingSlotList availableTimes={state} />
        </section>
    );
}

export { initializeTimes, updateTimes };