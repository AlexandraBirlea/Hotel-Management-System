// src/components/GuestDashboard.js
import React from "react";
import ListRooms from "./ListRooms";
import ReserveRoom from "./ReserveRoom";
import SupportChatWidget from "./SupportChatWidget";

export default function GuestDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="page">
        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Guest Dashboard</h1>
              <p className="page-subtitle">
                Browse available rooms and create your reservation.
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
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Available rooms</h2>
                <span className="badge badge-blue">Live</span>
              </div>
              {/* aici ListRooms afișează și filtrele noi */}
              <ListRooms compact />
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Make a reservation</h2>
                <p className="card-subtitle">
                  Choose dates and confirm your booking.
                </p>
              </div>
              <ReserveRoom />
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <h2 className="card-title">Hotel contact details</h2>
              <p className="card-subtitle">
                If you need help with your stay, contact us directly.
              </p>
            </div>
            <div className="card-body">
              <p>
                <strong>AMI Hotel</strong>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+40123456789">
                  +40 123 456 789
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:AMIhotel@gmail.com">
                  AMIhotel@gmail.com
                </a>
              </p>
              <p>Address: Str. Bucuresti 10, Cluj-Napoca, România</p>
            </div>
          </div>
        </div>
      </div>

      <SupportChatWidget />
    </>
  );
}
