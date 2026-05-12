import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !image) {
      alert("Please enter product name, price, and image.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await fetch("/api/products/upload", {
        method: "POST",
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Image upload failed");
      }

      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          image: uploadData.url
        })
      });

      if (!productRes.ok) {
        const productData = await productRes.json();
        throw new Error(productData.message || "Product save failed");
      }

      setName("");
      setPrice("");
      setImage(null);
      await fetchProducts();
      alert("Product added successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Product Manager</h1>
        <div className="admin-info">
          <Link className="admin-link" to="/">View Storefront</Link>
          <Link className="admin-link" to="/admin">Admin Dashboard</Link>
        </div>
      </div>

      <form className="add-product-form" onSubmit={addProduct}>
        <h2>Add Product</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h2>Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={product.image || "https://via.placeholder.com/80"}
                    alt={product.name}
                    width="80"
                    height="80"
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                </td>
                <td>{product.name}</td>
                <td>Rs.{product.price}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
