import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const menuRef = useRef();

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

