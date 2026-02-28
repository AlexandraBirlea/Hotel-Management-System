// src/components/AssignGuestToRoom.js
import React, { useState } from "react";
import { API_BASE } from "../App";

export default function AssignGuestToRoom() {
  const [guestId, setGuestId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      guestId: parseInt(guestId, 10),
      roomId: parseInt(roomId, 10),
      checkIn,   // format YYYY-MM-DD (input type="date" da deja formatul asta)
      checkOut,
    };

    const resp = await fetch(`${API_BASE}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (resp.ok) {
      alert("Reservation created");
      setGuestId("");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
    } else {
      alert("Error creating reservation");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Guest ID"
        value={guestId}
        onChange={(e) => setGuestId(e.target.value)}
      />
      <input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      <button type="submit">Assign Guest to Room</button>
    </form>
  );
}
