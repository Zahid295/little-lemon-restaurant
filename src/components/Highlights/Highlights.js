import SpecialsCard from "./SpecialsCard";

const specials = [
  {
    name: "Greek Salad",
    price: "$12.99",
    description: "Crisp lettuce, peppers, olives and feta cheese.",
    image: "images/greek-salad.jpg",
  },
  {
    name: "Bruschetta",
    price: "$5.99",
    description: "Grilled bread topped with garlic and tomatoes.",
    image: "images/bruschetta.jpg",
  },
  {
    name: "Lemon Dessert",
    price: "$4.99",
    description: "Sweet and tangy lemon cake.",
    image: "images/lemon-dessert.jpg",
  },
];

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
