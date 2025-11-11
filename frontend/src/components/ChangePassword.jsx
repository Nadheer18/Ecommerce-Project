import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Load username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setMessage("⚠️ No user logged in.");
    }
  }, []);

  const handleChangePassword = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating password.");
    }
  };

  // ✅ Navigate back to home
  const handleGoHome = () => {
    navigate("/home");
  };

  return (
  <div className="change-password-container">
    {/* 🏠 Home button on top-right */}
    <div className="top-bar">
      <button className="home-btn" onClick={handleGoHome}>🏠 Home</button>
    </div>

    <h2>Change Password</h2>
    <p><strong>User:</strong> {username}</p>

    <div className="input-group">
      <label>Current Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
    </div>

    <div className="input-group">
      <label>New Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>

    <div className="checkbox-group">
      <input
        type="checkbox"
        checked={showPassword}
        onChange={() => setShowPassword(!showPassword)}
      />
      <label>Show Password</label>
    </div>

    <button onClick={handleChangePassword}>Update Password</button>
    {message && <p className="status-message">{message}</p>}
  </div>
);
}

export default ChangePassword;

