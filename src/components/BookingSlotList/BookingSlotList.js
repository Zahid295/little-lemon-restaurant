import BookingSlot from "../BookingSlot/BookingSlot";
// import "./BookingSlotList.css";

export default function BookingSlotList({ availableTimes }) {
  return (
    <div 
    className="booking-slot-list"
    aria-labelledby="available-slots-heading"
    >
      <h2 id="available-slots-heading">Available Slots</h2>

      {availableTimes.length === 0 && <p>No available slots.</p>}

      {availableTimes.map((time) => (
        <BookingSlot key={time} time={time} />
      ))}
    </div>
  );
}
