import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setMessage("Please enter your username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", {
        username,
        password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectTo;
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label="Login">
        <div className="auth-brand-panel">
          <div className="brand-mark">E</div>
          <p className="eyebrow">E-Commerce Marketplace</p>
          <h1>Welcome back to smarter shopping.</h1>
          <p className="brand-copy">
            Sign in to explore curated products, manage your cart, and continue
            your shopping experience from any device.
          </p>
          <div className="auth-highlights">
            <span>Secure login</span>
            <span>Fast checkout</span>
            <span>24/7 support</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-card-header">
            <p className="eyebrow">Customer Access</p>
            <h2>Login to your account</h2>
            <p>Use your username and password to continue.</p>
          </div>

          {message && <div className="auth-message error">{message}</div>}

          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            New customer? <Link to="/register">Create an account</Link>
          </p>

          <Link className="auth-preview-link" to="/">
            Preview storefront without login
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Auth;
