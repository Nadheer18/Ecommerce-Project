import React, { useState } from "react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin@123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/admin";
    } else {
      alert("❌ Invalid admin credentials!");
    }
  };

  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>🔐 Admin Login</h1>
      <form onSubmit={handleLogin} style={{
        display: "inline-block",
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
      }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: "10px", padding: "8px", width: "200px" }}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "10px", padding: "8px", width: "200px" }}
        /><br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#004aad",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;

