import React, { useEffect, useState } from "react";
import "./Products.css";
import AddToCartButton from "./AddToCartButton";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="products-page">
      <h1>🛍 Available Products</h1>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            {/* Add to cart button */}
            <AddToCartButton productId={p.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

