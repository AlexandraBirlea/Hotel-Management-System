// src/components/EmployeeLogin.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../App";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      setError("Invalid email or password");
      return;
    }

    const user = await resp.json();
    if (user.role !== "EMPLOYEE") {
      setError("This account is not an employee account");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/employee");
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Employee Login</h1>
            <p className="page-subtitle">
              Sign in to manage rooms, guests and reservations.
            </p>
          </div>
          <Link to="/">
            <button className="btn btn-secondary">Back to home</button>
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 420 }}>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary" type="submit">
              Login
            </button>

            {error && <div className="text-error">{error}</div>}
          </form>

          <p className="mt-2 text-muted">
            Don&apos;t have an employee account?{" "}
            <Link to="/register/employee">Register as employee</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
