export default function SpecialsCard({ item }) {
  return (
    <article className="special-card">
      <img src={item.image} alt={item.name} className="special-img" />

      <div className="special-info">
        <div className="special-title">
          <h3>{item.title}</h3>
          <span className="price">{item.price}</span>
        </div>

        <p>{item.description}</p>

        <button className="delivery-btn">Order a Delivery</button>
      </div>
    </article>
  );
}
