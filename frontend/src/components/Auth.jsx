import React, { useState } from "react";
import "./Auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const handleRegister = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  // Login
  const handleLogin = async () => {
  try {
    const res = await fetch("http://192.168.75.150:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.message === "Login successful") {
      localStorage.setItem("username", username); // ✅ store username
      window.location.href = "/home";
    }
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <h1>Welcome to E-Commerce 🛒</h1>
        <div className="auth-box">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-group">
            <p>
  Don’t have an account?{" "}
  <a href="/register" style={{ color: "#007bff", textDecoration: "none" }}>
    Create Account
  </a>
</p>

            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

