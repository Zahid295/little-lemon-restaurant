import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm/BookingForm";
import BookingSlotList from "../components/BookingSlotList/BookingSlotList";
import { getCsrfToken } from "../context/AuthContext";
import "./Reservations.css";

const API_URL = "http://127.0.0.1:8000/api";

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function Reservations() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: getLocalDateString(new Date()),
        time: "",
        guests: 1,
        occasion: "birthday",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
    });
    const [availableTimes, setAvailableTimes] = useState([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [availabilityError, setAvailabilityError] = useState("");
    const [submissionError, setSubmissionError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availabilityVersion, setAvailabilityVersion] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadAvailableTimes() {
            setIsLoadingTimes(true);
            setAvailabilityError("");
            try {
                const params = new URLSearchParams({
                    date: form.date,
                    guests: String(form.guests),
                });
                const response = await fetch(
                    `${API_URL}/reservations/availability?${params.toString()}`,
                    { signal: controller.signal }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.detail || "Unable to load available times.");
                }
                setAvailableTimes(data.available_times);
                setForm((current) =>
                    data.available_times.includes(current.time)
                        ? current
                        : { ...current, time: "" }
                );
            } catch (error) {
                if (error.name !== "AbortError") {
                    setAvailabilityError(error.message || "Unable to load available times.");
                    setAvailableTimes([]);
                }
            } finally {
                if (!controller.signal.aborted) setIsLoadingTimes(false);
            }
        }

        loadAvailableTimes();
        return () => controller.abort();
    }, [form.date, form.guests, availabilityVersion]);

    function updateDate(date) {
        setForm((current) => ({ ...current, date, time: "" }));
    }

    function updateGuests(guests) {
        setForm((current) => ({ ...current, guests, time: "" }));
    }

    async function submitReservation() {
        setSubmissionError("");
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/reservations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 409) {
                    setAvailabilityVersion((version) => version + 1);
                }
                const firstError = Object.values(data).flat()[0];
                throw new Error(data.detail || firstError || "Unable to make this reservation.");
            }
            navigate(`/confirmed/${data.confirmation_code}`);
        } catch (error) {
            setSubmissionError(error.message || "Unable to make this reservation.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="reservations-page" aria-labelledby="reservations-heading">
            <h1 id="reservations-heading">Reserve a Table</h1>
            <p>Please fill in the form below to complete your reservation.</p>

            <BookingForm
                form={form}
                setForm={setForm}
                updateDate={updateDate}
                updateGuests={updateGuests}
                availableTimes={availableTimes}
                isLoadingTimes={isLoadingTimes}
                availabilityError={availabilityError}
                submissionError={submissionError}
                isSubmitting={isSubmitting}
                submitReservation={submitReservation}
            />
            <BookingSlotList availableTimes={availableTimes} />
        </section>
    );
}