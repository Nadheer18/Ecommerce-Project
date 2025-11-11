import React, { useState, useEffect } from "react";
import "./Admin.css";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");

  // Admin login handler
  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setMessage(data.message);
        fetchUsers();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("❌ Error logging in");
    }
  };

  const fetchUsers = async () => {
    const res = await fetch("http://192.168.75.150:3000/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(`http://192.168.75.150:3000/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>👑 Admin Dashboard</h2>
      <button
        className="toggle-btn"
        onClick={() => setShowPasswords(!showPasswords)}
      >
        {showPasswords ? "Hide Passwords" : "Show Passwords"}
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                {showPasswords ? user.password : "********"}
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;

