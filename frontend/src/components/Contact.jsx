import React from "react";
import Navbar from "./Navbar";

function Contact() {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", textAlign: "center" }}>
        <h2>📞 Contact Us</h2>
        <p>Email: support@ecommerce.com</p>
        <p>Phone: +91 9876543210</p>
      </div>
    </div>
  );
}

export default Contact;

