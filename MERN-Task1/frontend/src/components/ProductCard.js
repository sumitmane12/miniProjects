import "./ProductCard.css";

function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p className="price">₹ {price}</p>
    </div>
  );
}

export default ProductCard;
