import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

const contactCards = [
  {
    title: "Customer Care",
    value: "+91 9995993979",
    text: "Call us for order updates, account help, and shopping support."
  },
  {
    title: "Email Support",
    value: "nadheer.support@gmail.com",
    text: "Send product, delivery, or return questions anytime."
  },
  {
    title: "Business Hours",
    value: "9:00 AM - 8:00 PM",
    text: "Available Monday to Saturday for priority customer requests."
  }
];

function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-deal-bar">
        <span>FLOWMART customer care</span>
        <span>Fast replies for orders and support</span>
      </div>

      <header className="contact-header">
        <Link to="/" className="contact-logo">FLOWMART</Link>
        <nav>
          <Link to="/">Storefront</Link>
          <Link to="/support">Support</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <section className="contact-hero">
        <div>
          <p className="section-label">Contact Us</p>
          <h1>We are here to help with your shopping experience.</h1>
          <p>
            Reach us for product questions, order help, returns, payment issues,
            or anything that needs quick attention.
          </p>
          <div className="contact-actions">
            <Link to="/support">Raise Support Ticket</Link>
            <a href="mailto:nadheer.support@gmail.com">Email Us</a>
          </div>
        </div>
        <aside className="contact-mini-panel">
          <strong>Average response</strong>
          <span>Under 24 hours</span>
          <strong>Priority channel</strong>
          <span>Support ticket</span>
        </aside>
      </section>

      <section className="contact-grid">
        {contactCards.map((card) => (
          <article className="contact-card" key={card.title}>
            <p>{card.title}</p>
            <h2>{card.value}</h2>
            <span>{card.text}</span>
          </article>
        ))}
      </section>

      <section className="contact-info-section">
        <div>
          <p className="section-label">How We Help</p>
          <h2>Support for every stage of your order</h2>
        </div>
        <div className="contact-info-list">
          <div>
            <strong>Before Purchase</strong>
            <p>Product details, pricing, availability, offers, and recommendations.</p>
          </div>
          <div>
            <strong>After Purchase</strong>
            <p>Order status, cart issues, delivery questions, and payment help.</p>
          </div>
          <div>
            <strong>Returns</strong>
            <p>Return requests, replacement guidance, and refund status support.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
