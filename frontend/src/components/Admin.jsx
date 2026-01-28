import React, { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [username] = useState(localStorage.getItem("username") || "Admin");

  // ============================
  // Fetch Products
  // ============================
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ============================
  // Fetch Users
  // ============================
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ============================
  // Add Product (with Image Upload)
  // ============================
  const addProduct = async () => {
    if (!name || !price || !image) {
      return alert("Please enter product name, price and upload an image!");
    }

    try {
      // STEP 1 → Upload Image
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url; // returned as "/uploads/file.jpg"

      // STEP 2 → Save Product
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image: imageUrl }),
      });

      alert("✅ Product added successfully!");

      setName("");
      setPrice("");
      setImage(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  // ============================
  // Delete Product
  // ============================
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      alert("🗑 Product deleted!");
      fetchProducts();
    } catch (err) {
      alert("❌ Error deleting product");
      console.error(err);
    }
  };

  // ============================
  // Delete User
  // ============================
  const deleteUser = async (userToDelete) => {
    if (!window.confirm(`Delete user "${userToDelete}"?`)) return;

    try {
      await fetch(`/api/auth/delete/${userToDelete}`, {
        method: "DELETE",
      });

      alert(`🗑 User "${userToDelete}" deleted!`);
      fetchUsers();
    } catch (err) {
      alert("❌ Error deleting user");
      console.error(err);
    }
  };

  // Load data on page load
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>👨‍💼 Admin Dashboard</h1>

        <div className="admin-info">
          <span>Welcome, <b>{username}</b></span>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Add Product */}
      <div className="add-product-form">
        <h2>Add New Product 🛒</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
        />

        {/* File Upload Input */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={addProduct}>➕ Add Product</button>
      </div>

      {/* Product List */}
      <h2>📦 Products List</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={"" + p.image}
                    alt={p.name}
                    width="80"
                    height="80"
                    style={{ borderRadius: "8px" }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteProduct(p.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No products found</td></tr>
          )}
        </tbody>
      </table>

      {/* User List */}
      <h2>👥 Users List</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(u.username)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No users found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;

