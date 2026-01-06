import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import API from "../api";   // ⭐ Added for Cart API

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [cartCount, setCartCount] = useState(0);   // ⭐ Cart Count State
  const menuRef = useRef();

  // ⭐ Load username + click outside menu
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Cart Count Loader Function
  const loadCartCount = async () => {
    try {
      const res = await API.get("/cart");
      if (res.data.success) {
        const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      }
    } catch (err) {
      setCartCount(0);
    }
  };

  // ⭐ Load cart count on page load + update event listener
  useEffect(() => {
    loadCartCount();

    const update = () => loadCartCount();
    window.addEventListener("cartUpdated", update);

    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo">🛒 E-Commerce</div>

      <ul className="nav-links">
        <li><Link to="/home">🏠 Home</Link></li>
        <li><Link to="/products">🛍 Products</Link></li>
        <li><Link to="/contact">📞 Contact</Link></li>
        <li><Link to="/support">💬 Support</Link></li>

        {/* ⭐ New Cart Link */}
        <li>
          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>
        </li>
      </ul>

      <div className="profile-section" ref={menuRef}>
        <div className="avatar" onClick={() => setShowMenu(!showMenu)}>
          <span>{username ? username.charAt(0).toUpperCase() : "U"}</span>
        </div>

        {showMenu && (
          <div className="dropdown-menu">
            <p className="username">👤 {username}</p>
            <hr />
            <button onClick={() => (window.location.href = "/change-password")}>Change Password</button>
            <button>Settings</button>
            <button onClick={handleLogout} className="logout">
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

