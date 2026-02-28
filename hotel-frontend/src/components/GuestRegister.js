import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../App";

export default function GuestRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resp = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role: "GUEST",
      }),
    });

    if (!resp.ok) {
      setError("Could not register. Maybe this email is already used.");
      return;
    }

    navigate("/login/guest");
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Create guest account</h1>
            <p className="page-subtitle">
              Sign up to start booking rooms in our hotel.
            </p>
          </div>
          <Link to="/">
            <button className="btn btn-secondary">Back to home</button>
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 440 }}>
          <div className="card-header">
            <h2 className="card-title">Guest registration</h2>
            <span className="badge badge-blue">Free</span>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Email address"
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
              Create account
            </button>

            {error && <div className="text-error">{error}</div>}
          </form>

          <p className="mt-2 text-muted">
            Already have an account?{" "}
            <Link to="/login/guest">Login as guest</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
