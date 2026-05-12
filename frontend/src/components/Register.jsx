import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!username.trim() || !password.trim()) {
      setMessage("Please choose a username and password.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/register", { username, password });
      setMessage(res.data.message || "Account created successfully. You can login now.");
      setMessageType("success");
      setUsername("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create account. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-shell" aria-label="Create account">
        <div className="auth-brand-panel">
          <div className="brand-mark">E</div>
          <p className="eyebrow">Join The Marketplace</p>
          <h1>Create your shopping account in seconds.</h1>
          <p className="brand-copy">
            Save your details, browse featured collections, and keep your cart
            ready whenever you come back.
          </p>
          <div className="auth-highlights">
            <span>Easy setup</span>
            <span>Personal cart</span>
            <span>Fresh deals</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleRegister}>
          <div className="auth-card-header">
            <p className="eyebrow">Account Setup</p>
            <h2>Create account</h2>
            <p>Choose simple login details to get started.</p>
          </div>

          {message && <div className={`auth-message ${messageType}`}>{message}</div>}

          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
