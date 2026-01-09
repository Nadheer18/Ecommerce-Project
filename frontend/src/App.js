import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Products from "./components/Products";
import Contact from "./components/Contact";
import Support from "./components/Support";
import CartPage from "./components/CartPage";
import Register from "./components/Register";
import ChangePassword from "./components/ChangePassword";

function Layout({ children }) {
  const location = useLocation();

  // ❌ Hide navbar on login & register
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="page-content">{children}</div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

