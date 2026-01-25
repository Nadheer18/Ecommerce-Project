import React, { useState } from "react";
import Navbar from "./Navbar";        // ✅ ADD THIS
import { createSupportTicket } from "../services/api";
import "./Support.css";

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
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      <div className="support-container">
        <h2>Customer Support</h2>
        <p>
          If you have an issue with an order, raise a ticket here — you will get a
          ticket ID.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            type="email"
            required
          />

          <input
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            placeholder="Order ID (optional)"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your issue"
            required
            rows={6}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        {ticket && (
          <div className="success-box">
            <strong>Success!</strong>
            <div>
              Your Ticket ID: <code>{ticket}</code>
            </div>
          </div>
        )}

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </>
  );
}

