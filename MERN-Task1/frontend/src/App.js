import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">🛒 Products</h1>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products found</p>
      ) : (
        <div className="products-grid">
          {products.map(p => (
            <ProductCard key={p._id} name={p.name} price={p.price} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
