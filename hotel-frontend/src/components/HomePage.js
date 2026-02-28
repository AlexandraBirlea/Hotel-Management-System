import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page">
      <div className="page-inner">
        <div className="hero">
          <h1 className="hero-title">Welcome to our hotel</h1>
          <p className="hero-subtitle">
            Book your perfect stay as a guest or manage rooms and reservations
            as an employee.
          </p>

          <div className="hero-actions">
            <Link to="/login/guest">
              <button className="btn btn-primary">Login as Guest</button>
            </Link>

            <Link to="/register/guest">
              <button className="btn btn-secondary">Register as Guest</button>
            </Link>

            <Link to="/login/employee">
              <button className="btn btn-secondary">Employee Login</button>
            </Link>

            <Link to="/register/employee">
              <button className="btn btn-secondary">Register as Employee</button>
            </Link>
          </div>

          <p className="mt-2" style={{ fontSize: 12, opacity: 0.9 }}>
            Employees can add rooms, manage guests and see all reservations.
          </p>
        </div>
      </div>
    </div>
  );
}
