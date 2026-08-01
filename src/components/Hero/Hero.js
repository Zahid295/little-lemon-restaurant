import "./Hero.css";
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Little Lemon</h1>

        <h4>
          Chicago
        </h4>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>

        <button>Reserve a Table</button>
      </div>

      <div className="hero-image">
        <img src="images/hero-image.jpg" alt="Little Lemon Restaurant" />
      </div>
    </section>
  );
}
