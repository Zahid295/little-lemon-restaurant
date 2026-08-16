import { Link } from "react-router-dom";

export default function SpecialsCard({ item, addToCart, showOrderLink = true, showAddToCart = false }) {
  return (
    <article className="special-card">
      <img src={item.image} alt={item.name} className="special-img" />

      <div className="special-info">
        <div className="special-title">
          <h3>{item.title}</h3>
          <span className="price">{item.price}</span>
        </div>

        <p>{item.description}</p>

        {showOrderLink && (
          <Link to="/order-online" className="delivery-btn">
          Order a Delivery
        </Link>
        )}
                {showAddToCart && (
          <button 
            className="delivery-btn"
            onClick={() => addToCart(item, 1)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
