import "./About.css";
export default function About() {
  return (
    <section className="about">
      <div className="about-text">
        <h2 className="about-title">Little Lemon</h2>
        <h3 className="about-location">Chicago</h3>
        <p className="about-description">
          Little Lemon is run by two passionate brothers who bring
          Mediterranean flavors to Chicago with love and tradition.
        </p>
      </div>

      <div className="about-images">
        <img src="images/Mario-and-adrian-A.jpg" alt="Owner 1" className="about-img img-front" />
        <img src="images/Mario-and-adrian-b.jpg" alt="Owner 2" className="about-img img-back" />
      </div>
    </section>
  );
}
