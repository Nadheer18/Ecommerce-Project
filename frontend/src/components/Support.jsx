import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createSupportTicket } from "../services/api";
import "./Support.css";

const helpTopics = [
  "Order status",
  "Payment issue",
  "Return request",
  "Product question"
];

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const useTopic = (topic) => {
    setForm((current) => ({
      ...current,
      message: current.message || `${topic}: `
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTicket(null);

    try {
      const res = await createSupportTicket(form);
      if (res && res.success) {
        setTicket(res.ticket || "No ticket returned");
        setForm({ name: "", email: "", orderId: "", message: "" });
      } else {
        setError(res?.error || "Failed to create ticket");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="support-page">
      <div className="support-deal-bar">
        <span>Need help with an order?</span>
        <span>Raise a ticket and track support faster</span>
      </div>

      <header className="support-header">
        <Link to="/" className="support-logo">FLOWMART</Link>
        <nav>
          <Link to="/">Storefront</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <section className="support-hero">
        <div>
          <p className="section-label">Support Center</p>
          <h1>Tell us what happened. We will help you resolve it.</h1>
          <p>
            Create a support ticket for delivery, cart, payment, return, or product
            issues. Add your order ID when available for faster handling.
          </p>
        </div>
        <div className="support-stats">
          <div>
            <strong>24h</strong>
            <span>Typical response</span>
          </div>
          <div>
            <strong>4</strong>
            <span>Common help topics</span>
          </div>
        </div>
      </section>

      <section className="support-layout">
        <aside className="help-topics">
          <p className="section-label">Quick Topics</p>
          <h2>What do you need help with?</h2>
          <div>
            {helpTopics.map((topic) => (
              <button key={topic} type="button" onClick={() => useTopic(topic)}>
                {topic}
              </button>
            ))}
          </div>
        </aside>

        <form className="support-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <p className="section-label">Create Ticket</p>
            <h2>Support request</h2>
          </div>

          <div className="support-form-grid">
            <label>
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                type="email"
                required
              />
            </label>
          </div>

          <label>
            <span>Order ID</span>
            <input
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue"
              required
              rows={7}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>

          {ticket && (
            <div className="support-message success">
              <strong>Ticket created.</strong>
              <span>Your Ticket ID: {ticket}</span>
            </div>
          )}

          {error && (
            <div className="support-message error">
              <strong>Error:</strong>
              <span>{typeof error === "string" ? error : "Unable to create ticket."}</span>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
