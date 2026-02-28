// src/components/AddRoom.js
import React, { useState } from "react";
import { API_BASE } from "../App";

export default function AddRoom() {
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // validări simple
    if (!number || !type || !capacity || !price || !totalUnits) {
      setMessage("Te rog completează toate câmpurile obligatorii.");
      return;
    }

    const body = {
      number,
      type,
      capacity: parseInt(capacity, 10),
      price: parseFloat(price),
      imageUrl: imageUrl || null,
      totalUnits: parseInt(totalUnits, 10), // numărul de camere de acest tip
    };

    try {
      const resp = await fetch(`${API_BASE}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Error creating room:", resp.status, txt);
        setMessage("Eroare la adăugarea camerei.");
        return;
      }

      setMessage("Camera a fost adăugată cu succes!");
      // reset form
      setNumber("");
      setType("");
      setCapacity("");
      setPrice("");
      setImageUrl("");
      setTotalUnits("");
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Eroare de rețea la adăugarea camerei.");
    }
  };

  const isError = message.startsWith("Eroare") || message.startsWith("Te rog");

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Room number
        </div>
        <input
          className="input"
          placeholder="101"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Type
        </div>
        <select
          className="select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Queen">Queen</option>
          <option value="Suite">Suite</option>
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Capacity
        </div>
        <input
          className="input"
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="2"
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Price per night (€)
        </div>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="120"
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Total units (number of rooms of this type)
        </div>
        <input
          className="input"
          type="number"
          min="1"
          value={totalUnits}
          onChange={(e) => setTotalUnits(e.target.value)}
          placeholder="5"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          Main image URL (optional)
        </div>
        <input
          className="input"
          placeholder="https://…"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" type="submit">
        Add room
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
  );
}
