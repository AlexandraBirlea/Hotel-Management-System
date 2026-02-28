import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../App";

export default function EmployeeRegister() {
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
        role: "EMPLOYEE",
      }),
    });

    if (!resp.ok) {
      setError("Could not register employee. Check data or email uniqueness.");
      return;
    }

    navigate("/login/employee");
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Create employee account</h1>
            <p className="page-subtitle">
              Employees can manage rooms, guests and all reservations.
            </p>
          </div>
          <Link to="/">
            <button className="btn btn-secondary">Back to home</button>
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 440 }}>
          <div className="card-header">
            <h2 className="card-title">Employee registration</h2>
            <span className="badge badge-green">Staff</span>
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
              Create employee account
            </button>

            {error && <div className="text-error">{error}</div>}
          </form>

          <p className="mt-2 text-muted">
            Already an employee?{" "}
            <Link to="/login/employee">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
