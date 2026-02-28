// src/components/ListReservations.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../App";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

function statusClass(status) {
  if (!status) return "badge";
  const s = status.toUpperCase();
  if (["BOOKED", "CONFIRMED"].includes(s)) return "badge badge-blue";
  if (["CHECKED_IN", "ACTIVE"].includes(s)) return "badge badge-green";
  return "badge";
}

export default function ListReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReservations = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/reservations`)
      .then((r) => r.json())
      .then(setReservations)
      .catch((e) => console.error("Error loading reservations", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Reservations</h3>
          <p className="card-subtitle">
            Overview of all current and upcoming bookings.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadReservations}
        >
          Reload
        </button>
      </div>

      {loading && <div className="text-muted">Loading reservations…</div>}

      {!loading && reservations.length === 0 && (
        <div className="text-muted">No reservations found.</div>
      )}

      {!loading && reservations.length > 0 && (
        <ul className="list">
          {reservations.map((res) => (
            <li key={res.id} className="list-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    #{res.id} · Room {res.room?.number} ({res.room?.type})
                  </div>
                  <div className="text-muted">
                    Guest:{" "}
                    <strong>{res.guest?.name || "Unknown guest"}</strong>{" "}
                    {res.guest?.email && <> · {res.guest.email}</>}
                  </div>
                  <div className="text-muted">
                    {formatDate(res.checkIn)} → {formatDate(res.checkOut)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className={statusClass(res.status)}>
                    {res.status || "UNKNOWN"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
