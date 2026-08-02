import "./Highlights.css";
import specials from "../../data/specials";
import SpecialsCard from "./SpecialsCard";

export default function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-header">
        <h2>THIS WEEK'S SPECIALS!</h2>
        <button className="menu-btn">Online Menu</button>
      </div>

      <div className="specials-scroll">
        {specials.map((item, index) => (
          <SpecialsCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
