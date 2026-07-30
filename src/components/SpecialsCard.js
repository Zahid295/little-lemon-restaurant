export default function SpecialsCard({ item }) {
  return (
    <div className="special-card">
      <img src={item.image} alt={item.name} />

      <div className="special-info">
        <div className="special-title">
          <h3>{item.name}</h3>
          <span>{item.price}</span>
        </div>

        <p>{item.description}</p>

        <button>Order a Delivery</button>
      </div>
    </div>
  );
}
