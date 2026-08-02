export default function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">
      <div className="rating">{"* ".repeat(testimonial.rating).trim()}</div>

      <img src={testimonial.image} alt={testimonial.name} />

      <h3 className="testimonial-name">{testimonial.name}</h3>
      <p className="testimonial-text">{testimonial.review}</p>
    </div>
  );
}
