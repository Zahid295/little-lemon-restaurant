import "./Highlights.css";
import specials from "../../data/specials";
import SpecialsCard from "./SpecialsCard";

export default function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-header">
        <h2>Specials</h2>
        <button>Online Menu</button>
      </div>

      <div className="specials-scroll">
        {specials.map((item, index) => (
          <SpecialsCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
