import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Products from "./components/Products";
import Contact from "./components/Contact";
import ChangePassword from "./components/ChangePassword";
import Admin from "./components/Admin";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
	<Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/change-password" element={<ChangePassword username="test" />} />
	<Route path="/admin" element={<Admin />} /> 
      </Routes>
    </Router>
  );
}

export default App;

