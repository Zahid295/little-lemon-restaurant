import "./About.css";
export default function About() {
  return (
    <section className="about">
      <div className="about-text">
        <h2>Little Lemon</h2>
        <h3>Chicago</h3>
        <p>
          Little Lemon is run by two passionate brothers who bring
          Mediterranean flavors to Chicago with love and tradition.
        </p>
      </div>

      <div className="about-images">
        <img src="images/adrian.jpg" alt="Owner 1" />
        <img src="images/mario.jpg" alt="Owner 2" />
      </div>
    </section>
  );
}
