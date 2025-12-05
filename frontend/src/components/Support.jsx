import React, { useState } from "react";
import { createSupportTicket } from "../services/api";
import "./Support.css"; // optional: add styles or reuse existing CSS

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
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2>Customer Support</h2>
      <p>If you have an issue with an order, raise a ticket here — you will get a ticket ID.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            type="email"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            placeholder="Order ID (optional)"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your issue"
            required
            rows={6}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", orderId: "", message: "" });
              setError(null);
              setTicket(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {ticket && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #4caf50", borderRadius: 6 }}>
          <strong>Success!</strong>
          <div>Your Ticket ID: <code>{ticket}</code></div>
          <div>We will update the ticket in Jira — you can quote the ticket ID when contacting us.</div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ff5252", borderRadius: 6 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

