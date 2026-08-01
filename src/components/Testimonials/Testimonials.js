import "./Testimonials.css";
import testimonials from "../../data/testimonials";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>

      <div className="testimonials-scroll">
        {testimonials.map((t, index) => (
          <TestimonialCard key={index} testimonial={t} />
        ))}
      </div>
    </section>
  );
}
