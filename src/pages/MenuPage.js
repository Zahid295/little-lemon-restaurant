import specials from "../data/specials";
import SpecialsCard from "../components/Highlights/SpecialsCard";
import "./MenuPage.css";

export default function MenuPage() {
  return (
    <section className="menu-page">
      <h1 className="menu-title">Our Menu</h1>

      <div className="menu-items">
        {specials.map((item, index) => (
          <SpecialsCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}



