import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      window.location.href = "/"; // redirect if no user
    }
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <div className="overlay">
        <h1>Welcome to the E-Commerce App 🛒</h1>
        <p>Hello, <strong>{username}</strong> 👋</p>
        <p>Shop smart. Live better.</p>
      </div>
    </div>
  );
}

export default Home;

