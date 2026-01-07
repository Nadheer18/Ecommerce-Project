import React, { useState } from "react";
import API from "../api";
import "./Auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        window.location.href = "/home";
      } else {
        alert("Login failed — no token received");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", { username, password });
      alert(res.data.message);
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
              <a href="/register">Create Account</a>
            </p>
            <button onClick={handleLogin}>Login</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Auth;

