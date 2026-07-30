import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "John Doe",
    rating: 5,
    review: "Amazing food and great service!",
    image: "images/profile.png",
  },
  {
    name: "Sarah Smith",
    rating: 4,
    review: "Loved the atmosphere and the dishes.",
    image: "images/profile.png",
  },
 {
  name: "Emily",
  rating: 5,
  review: "The dishes were delicious and the staff was incredibly welcoming!",
  image: "images/profile.png",
}

];

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
