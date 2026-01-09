import React, { useState } from "react";
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
      if (res?.success) {
        setTicket(res.ticket);
        setForm({ name: "", email: "", orderId: "", message: "" });
      } else {
        setError(res?.error || "Failed to create ticket");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-container">
      <h2>Customer Support</h2>
      <p>Raise a support ticket — you will receive a ticket ID.</p>

      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" required />
        <input name="orderId" value={form.orderId} onChange={handleChange} placeholder="Order ID (optional)" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue" rows={5} required />

        <div className="support-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          <button type="button" onClick={() => setForm({ name:"", email:"", orderId:"", message:"" })}>
            Reset
          </button>
        </div>
      </form>

      {ticket && (
        <div className="support-success">
          ✅ Ticket created: <strong>{ticket}</strong>
        </div>
      )}

      {error && <div className="support-error">❌ {error}</div>}
    </div>
  );
}

