import "./Hero.css";
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Little Lemon</h1>

        <h2>
          Chicago
        </h2>

        <p>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </p>

        <button className="hero-btn">Reserve a Table</button>
      </div>

      <div className="hero-image">
        <img src="images/hero-image.jpg" alt="Little Lemon Restaurant" />
      </div>
    </section>
  );
}
