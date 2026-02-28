// src/components/ListGuests.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function ListGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGuests = () => {
    setLoading(true);
    fetch(`${API_BASE}/guests`)
      .then((r) => r.json())
      .then(setGuests)
      .catch((e) => console.error("Error loading guests", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuests();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Guests</h3>
          <p className="card-subtitle">
            All registered guests that can book rooms.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadGuests}
        >
          Reload
        </button>
      </div>

      {loading && <div className="text-muted">Loading guests…</div>}

      {!loading && guests.length === 0 && (
        <div className="text-muted">No guests found.</div>
      )}

      {!loading && guests.length > 0 && (
        <ul className="list">
          {guests.map((g) => (
            <li key={g.id} className="list-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div className="text-muted">{g.email}</div>
                </div>
                {/* dacă ai număr de rezervări la guest, poți afișa aici un badge */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
