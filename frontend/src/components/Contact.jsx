import React from "react";
import Navbar from "./Navbar";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="contact-container page-content">
        <h2>📞 Contact Us</h2>
        <p>Email: nadheer.support@gmail.com</p>
        <p>Phone: +91 9995993979</p>
      </div>
    </>
  );
}

export default Contact;

