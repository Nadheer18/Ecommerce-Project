import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://192.168.75.150:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleRegister} style={styles.button}>
        Create Account
      </button>
      <p>
        Already have an account?{" "}
        <a href="/" style={styles.link}>
          Login here
        </a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "250px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Register;

