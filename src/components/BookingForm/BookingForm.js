import "./BookingForm.css";

export default function BookingForm({
  form,
  setForm,
  updateDate,
  updateGuests,
  availableTimes,
  isLoadingTimes,
  availabilityError,
  submissionError,
  isSubmitting,
  submitReservation,
}) {
  const formValid =
    form.date !== "" &&
    form.time !== "" &&
    form.customer_name.trim() !== "" &&
    form.customer_email.trim() !== "" &&
    form.customer_phone.trim() !== "" &&
    form.guests >= 1 &&
    form.guests <= 10;

  function handleSubmit(event) {
    event.preventDefault();
    submitReservation();
  }

  return (
    <form 
    className="booking-form"
    aria-labelledby="reservations-heading"
    onSubmit={handleSubmit}
    >
        <label htmlFor="res-name">Full name</label>
        <input
          type="text"
          id="res-name"
          autoComplete="name"
          value={form.customer_name}
          onChange={(event) => setForm({ ...form, customer_name: event.target.value })}
          required
        />

        <label htmlFor="res-email">Email</label>
        <input
          type="email"
          id="res-email"
          autoComplete="email"
          value={form.customer_email}
          onChange={(event) => setForm({ ...form, customer_email: event.target.value })}
          required
        />

        <label htmlFor="res-phone">Phone</label>
        <input
          type="tel"
          id="res-phone"
          autoComplete="tel"
          value={form.customer_phone}
          onChange={(event) => setForm({ ...form, customer_phone: event.target.value })}
          required
        />

        <label htmlFor="res-date">Choose date</label>
        <input
        type="date"
        id="res-date"
        value={form.date}
        onChange={(event) => updateDate(event.target.value)}
        required
        min={(() => {
          const today = new Date();
          return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        })()}
        aria-required="true"
        />

        <label htmlFor="res-time" data-testid = "choose-time-label">Choose time</label>
        <select 
        id="res-time"
        value={form.time}
        onChange={(event) => setForm({ ...form, time: event.target.value })}
        required
        aria-required="true"
        disabled={isLoadingTimes || availableTimes.length === 0}
        >
            <option value="" disabled>
              {isLoadingTimes ? "Loading times..." : "Select a time"}
            </option>
            {availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
                ))}
        </select>

        <label htmlFor="guests" data-testid = "guests-label">Number of guests</label>
        <input 
        type="number"
        id="guests"
        min="1"
        max="10"
        value={form.guests}
        onChange={(event) => updateGuests(Number(event.target.value))}
        required
        aria-required="true"
        />

        <label htmlFor="occasion">Occasion</label>
        <select id="occasion"
        value={form.occasion}
        onChange={(event) => setForm({ ...form, occasion: event.target.value })}>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="other">Other</option>
        </select>

        {availabilityError && <p className="booking-error" role="alert">{availabilityError}</p>}
        {submissionError && <p className="booking-error" role="alert">{submissionError}</p>}

        <button type="submit" disabled={!formValid || isLoadingTimes || isSubmitting}>
          {isSubmitting ? "Booking..." : "Make your Reservation"}
        </button>
    </form>
  );
}