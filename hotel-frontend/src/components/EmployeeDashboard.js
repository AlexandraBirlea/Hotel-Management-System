import React from "react";
import AddRoom from "./AddRoom";
import ListRooms from "./ListRooms";
import AddGuest from "./AddGuest";
import ListGuests from "./ListGuests";
import ListReservations from "./ListReservations";

export default function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Employee Dashboard</h1>
            <p className="page-subtitle">
              Manage rooms, guests and reservations in one place.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            {user && (
              <div className="text-muted">
                Logged in as <strong>{user.name}</strong> ({user.email})
              </div>
            )}
            <button
              type="button"
              className="btn"
              style={{ marginTop: "0.5rem" }}
              onClick={handleBack}
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Add room</h2>
              </div>
              <AddRoom />
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">All rooms</h2>
              </div>
              <ListRooms showDelete />
            </div>
          </div>

          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Guests</h2>
              </div>
              <AddGuest />
              <div style={{ marginTop: 8 }}>
                <ListGuests />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Reservations</h2>
                <span className="badge badge-green">Overview</span>
              </div>
              <ListReservations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
