export default function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">
      <div className="rating">{"* ".repeat(testimonial.rating).trim()}</div>

      <img src={testimonial.image} alt={testimonial.name} />

      <h3>{testimonial.name}</h3>
      <p>{testimonial.review}</p>
    </div>
  );
}
