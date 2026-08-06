import "./BookingSlot.css";

export default function BookingSlot({ time }) {
  return (
    <div 
    className="booking-slot"
    role="listitem"
    >
      <p>{time}</p>
    </div>
  );
}
