import React, { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "Admin");

  // ✅ Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Add new product
  const addProduct = async () => {
    if (!name || !price) return alert("Please enter product name and price!");
    try {
      await fetch("http://192.168.75.150:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image }),
      });
      alert("✅ Product added successfully!");
      setName("");
      setPrice("");
      setImage("");
      fetchProducts();
    } catch (err) {
      alert("❌ Error adding product!");
      console.error(err);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://192.168.75.150:3000/api/products/${id}`, {
        method: "DELETE",
      });
      alert("🗑 Product deleted!");
      fetchProducts();
    } catch (err) {
      alert("❌ Error deleting product!");
      console.error(err);
    }
  };

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Delete user
  const deleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete user "${userToDelete}"?`)) return;
    try {
      await fetch(`http://192.168.75.150:3000/api/auth/delete/${userToDelete}`, {
        method: "DELETE",
      });
      alert(`🗑 User "${userToDelete}" deleted!`);
      fetchUsers();
    } catch (err) {
      alert("❌ Error deleting user!");
      console.error(err);
    }
  };

  // ✅ On page load
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // ✅ Logout function
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

      {/* Add Product Section */}
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
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
        />
        <button onClick={addProduct}>➕ Add Product</button>
      </div>

      {/* Product List Section */}
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
                    src={p.image || "https://via.placeholder.com/80"}
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

      {/* Users List Section */}
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

