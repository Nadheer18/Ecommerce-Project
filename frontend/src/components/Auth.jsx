import React, { useState } from "react";
import API from "../api";
import "./Auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  console.log("LOGIN BUTTON CLICKED"); // 🔍 step 1

  try {
    const res = await API.post("/auth/login", {
      username,
      password
    });

    console.log("LOGIN RESPONSE:", res.data); // 🔍 step 2

    if (res.data.token) {
      console.log("SAVING TOKEN TO LOCALSTORAGE"); // 🔍 step 3

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      window.location.href = "/home";
    } else {
      console.error("NO TOKEN RECEIVED");
      alert("Login failed: token missing");
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err);
    alert("Login failed");
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


