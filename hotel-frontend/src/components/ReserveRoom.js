// src/components/ReserveRoom.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { API_BASE } from "../App";

export default function ReserveRoom() {
  const user = JSON.parse(localStorage.getItem("user")); // logged guest

  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");

  const [checkIn, setCheckIn] = useState(null);   // Date
  const [checkOut, setCheckOut] = useState(null); // Date

  const [message, setMessage] = useState("");

  // all fully-booked dates for this room (for the whole horizon)
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  // fully-booked dates that fall INSIDE the selected interval
  const [intervalFullyBooked, setIntervalFullyBooked] = useState([]);

  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // load all rooms
  useEffect(() => {
    fetch(`${API_BASE}/api/rooms`)
      .then((r) => r.json())
      .then(setRooms)
      .catch((e) => console.error(e));
  }, []);

  // helper: Date -> "YYYY-MM-DD"
const toIsoDate = (date) => {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;   // YYYY-MM-DD în fusul tău orar, nu UTC
};

  // list of Date objects for react-datepicker
const fullyBookedDateObjects = fullyBookedDates
  .map((d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  })
  .filter(Boolean);

const isFullyBooked = (date) => {
  const iso = toIsoDate(date);
  return fullyBookedDates.includes(iso);
};


  // selection summary
  const selectedRoom = rooms.find(
    (r) => r.id === parseInt(roomId || "-1", 10)
  );

  let nights = 0;
  if (checkIn && checkOut) {
    const diffMs = checkOut - checkIn;
    if (diffMs > 0) {
      nights = diffMs / (1000 * 60 * 60 * 24);
    }
  }

  const totalPrice =
    selectedRoom && nights > 0
      ? (nights * selectedRoom.price).toFixed(2)
      : null;

  const isError = !!message && !message.toLowerCase().includes("success");

  /**
   * 1) When room changes, load ALL fully-booked dates for that room
   *    for a wide horizon: today → today + 1 year.
   *    This makes red/disabled days appear immediately when a room is selected.
   */
  useEffect(() => {
    if (!roomId) {
      setFullyBookedDates([]);
      setIntervalFullyBooked([]);
      return;
    }

    const loadAllFullyBookedForRoom = async () => {
      try {
        setLoadingAvailability(true);
        setFullyBookedDates([]);
        setIntervalFullyBooked([]);

        const today = new Date();
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        const params = new URLSearchParams({
          roomId: roomId,
          from: toIsoDate(today),
          to: toIsoDate(oneYearLater),
        });

        const resp = await fetch(
          `${API_BASE}/api/reservations/fully-booked?${params.toString()}`
        );
        if (!resp.ok) {
          console.error("Error fetching fully-booked dates:", resp.status);
          return;
        }
        const data = await resp.json(); // ["2025-12-03", ...]
        setFullyBookedDates(data || []);
      } catch (err) {
        console.error("Network error loading fully-booked dates:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAllFullyBookedForRoom();
  }, [roomId]);

  /**
   * 2) Whenever room / checkIn / checkOut change,
   *    compute which of the already loaded fullyBookedDates
   *    fall inside the selected interval.
   *    NU mai chemăm backend-ul aici.
   */
  useEffect(() => {
    if (!roomId || !checkIn || !checkOut || checkOut <= checkIn) {
      setIntervalFullyBooked([]);
      return;
    }

    const from = toIsoDate(checkIn);
    const to = toIsoDate(checkOut);

    const insideInterval = fullyBookedDates.filter(
      (d) => d >= from && d < to   // check-out is the day you leave
    );
    setIntervalFullyBooked(insideInterval);
  }, [roomId, checkIn, checkOut, fullyBookedDates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("You are not logged in as a guest.");
      return;
    }

    if (!roomId || !checkIn || !checkOut) {
      setMessage("Please select a room and a valid date interval.");
      return;
    }

    if (checkOut <= checkIn) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }

    // block reservation if there are fully booked days in interval
    if (intervalFullyBooked.length > 0) {
      setMessage(
        "Error: for this room there are already fully booked days in the selected interval."
      );
      return;
    }

    const body = {
      guestId: user.id,
      roomId: parseInt(roomId, 10),
      checkIn: toIsoDate(checkIn),
      checkOut: toIsoDate(checkOut),
    };

    try {
      const resp = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setMessage("Reservation created successfully!");
        setRoomId("");
        setCheckIn(null);
        setCheckOut(null);
        setFullyBookedDates([]);
        setIntervalFullyBooked([]);
      } else {
        const txt = await resp.text();
        console.error("Reservation error:", resp.status, txt);
        setMessage("Error while creating the reservation.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Network error while creating the reservation.");
    }
  };

  const formattedIntervalFullyBooked = intervalFullyBooked.map((d) => {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-GB");
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Make a reservation</h3>
          <p className="card-subtitle">
            Choose your room, select dates and confirm your stay.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Room select */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Room
          </div>
          <select
            className="select"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">Select room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.number} – {r.type} – {r.price} €/night
                {typeof r.totalUnits === "number"
                  ? ` (total units: ${r.totalUnits})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Dates with react-datepicker */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}
            >
              Check-in
            </div>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (checkOut && date && checkOut <= date) {
                  setCheckOut(null);
                }
              }}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="input"
              dayClassName={(date) =>
                isFullyBooked(date) ? "fully-booked-day" : undefined
              }
              excludeDates={fullyBookedDateObjects}
            />
          </div>

          <div>
            <div
              style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}
            >
              Check-out
            </div>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              dateFormat="dd/MM/yyyy"
              className="input"
              dayClassName={(date) =>
                isFullyBooked(date) ? "fully-booked-day" : undefined
              }
              excludeDates={fullyBookedDateObjects}
            />
          </div>
        </div>

        {/* availability text – only for selected interval */}
        {roomId && checkIn && checkOut && (
          <div style={{ marginBottom: 10, fontSize: 13 }}>
            {loadingAvailability && (
              <span className="text-muted">
                Loading fully booked dates for this room…
              </span>
            )}

            {!loadingAvailability && intervalFullyBooked.length === 0 && (
              <span style={{ color: "#15803d" }}>
                No fully booked days for this room in the selected interval.
              </span>
            )}

            {!loadingAvailability && intervalFullyBooked.length > 0 && (
              <div style={{ color: "#b91c1c" }}>
                <strong>
                  This room is fully booked on these dates in the selected
                  interval:
                </strong>
                <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                  {formattedIntervalFullyBooked.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
                <span style={{ fontSize: 12 }}>
                  Please choose different dates or another room type.
                </span>
              </div>
            )}
          </div>
        )}

        {/* reservation summary */}
        {selectedRoom && nights > 0 && (
          <div className="text-muted" style={{ marginBottom: 10 }}>
            {nights} night{nights > 1 ? "s" : ""} · {totalPrice} € total
          </div>
        )}

        <button className="btn btn-primary" type="submit">
          Make reservation
        </button>

        {message && (
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: isError ? "#b91c1c" : "#15803d",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
