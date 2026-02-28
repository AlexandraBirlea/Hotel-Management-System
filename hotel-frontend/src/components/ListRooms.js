// src/components/ListRooms.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../App";

// images per room type
const TYPE_IMAGES = {
  single: [
    "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  double: [
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/556443817.jpg?k=e0efbb98fec3e4c3295aadeeacaa64d609819fc142e4965e1f362c62c5562ee7&o=?auto=compress&cs=tinysrgb&w=800",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464213027.jpg?k=26f137bcd91b98d9fe945043bf487883ce24d9a407affd82a0f6ad8699fe551c&o=?auto=compress&cs=tinysrgb&w=800",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464213010.jpg?k=f4bd1c75484d422cc128f3c2a4be1d6e412853d291292b9ec5141fd7f935697f&o=?auto=compress&cs=tinysrgb&w=800",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464213016.jpg?k=45e0cf1266be753d5dc3e245970e56abee40ce2e8b9417a1970b60d8299f4288&o=?auto=compress&cs=tinysrgb&w=800",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464213007.jpg?k=eb4a0e2cde5c0c66c54e4611f4af3ee87eee7b70dc31d018979fc4660d88a7dc&o=?auto=compress&cs=tinysrgb&w=800",
  ],
  queen: [
    "https://cdn.pixabay.com/photo/2020/12/24/19/11/hotel-room-5858069_1280.jpg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2716393/pexels-photo-2716393.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  suite: [
    "https://cdn.pixabay.com/photo/2020/11/24/11/36/bedroom-5772286_1280.jpg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2716399/pexels-photo-2716399.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
};

const GENERIC_FALLBACK =
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800";

function getImagesForRoom(room) {
  const userImages = [room.imageUrl, room.imageUrl2, room.imageUrl3].filter(
    Boolean
  );

  const normType = (room.type || "").toLowerCase().trim();
  const typeImages = TYPE_IMAGES[normType] || [];

  if (userImages.length > 0) return userImages;
  if (typeImages.length > 0) return typeImages;
  return [GENERIC_FALLBACK];
}

export default function ListRooms({ showDelete = false }) {
  // lista completă de camere
  const [allRooms, setAllRooms] = useState([]);
  // lista filtrată afișată
  const [rooms, setRooms] = useState([]);

  // gallery
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // edit modal
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    number: "",
    type: "",
    capacity: "",
    price: "",
    totalUnits: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
  });

  // filtre (frontend)
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [minCapacityInput, setMinCapacityInput] = useState("");

  // load rooms once
  useEffect(() => {
    fetch(`${API_BASE}/api/rooms`)
      .then((r) => r.json())
      .then((data) => {
        setAllRooms(data);
        setRooms(data);
      })
      .catch((e) => console.error(e));
  }, []);

  // ------------ FILTER LOGIC (works for all filters together) ------------
  const applyFilters = () => {
    let filtered = [...allRooms];

    const minP = parseFloat(minPriceInput);
    const maxP = parseFloat(maxPriceInput);
    const minCap = parseInt(minCapacityInput, 10);
    const type = typeInput.trim().toLowerCase();

    if (!Number.isNaN(minP)) {
      filtered = filtered.filter((r) => r.price != null && r.price >= minP);
    }
    if (!Number.isNaN(maxP)) {
      filtered = filtered.filter((r) => r.price != null && r.price <= maxP);
    }
    if (type !== "") {
      filtered = filtered.filter(
        (r) =>
          r.type &&
          r.type.toLowerCase().includes(type) // allow "dou" -> "double"
      );
    }
    if (!Number.isNaN(minCap)) {
      filtered = filtered.filter(
        (r) => r.capacity != null && r.capacity >= minCap
      );
    }

    setRooms(filtered);
  };

  const applyPriceFilter = () => {
    applyFilters(); // folosește minPriceInput + maxPriceInput + celelalte deja setate
  };

  const applyAdvancedFilter = () => {
    applyFilters(); // folosește toate cele 4 filtre simultan
  };

  const resetFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setTypeInput("");
    setMinCapacityInput("");
    setRooms(allRooms);
  };

  // ---------------- GALLERY ----------------
  const openGallery = (room) => {
    const imgs = getImagesForRoom(room);
    setGalleryImages(imgs);
    setGalleryIndex(0);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const prevImage = () => {
    setGalleryIndex((idx) =>
      (idx - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const nextImage = () => {
    setGalleryIndex((idx) => (idx + 1) % galleryImages.length);
  };

  // --------- DELETE ----------
  const handleDelete = async (roomId, e) => {
    e.stopPropagation(); // don't open gallery

    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const resp = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (resp.status === 409) {
        const text = await resp.text();
        alert(
          text ||
            "You cannot delete this room because there are existing reservations for it."
        );
        return;
      }

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Delete failed:", resp.status, text);
        alert("Error deleting room on server (status " + resp.status + ").");
        return;
      }

      setAllRooms((prev) => prev.filter((r) => r.id !== roomId));
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error("Network / CORS error when deleting room:", err);
      alert(
        "Network error when deleting room. Please check that the backend is running on http://localhost:8080 and allows DELETE /api/rooms/{id}."
      );
    }
  };

  // --------- EDIT ----------
  const openEdit = (room, e) => {
    e.stopPropagation(); // don't open gallery
    setEditingRoom(room);
    setEditForm({
      number: room.number || "",
      type: room.type || "",
      capacity: room.capacity ?? "",
      price: room.price ?? "",
      totalUnits: room.totalUnits ?? "",
      imageUrl: room.imageUrl || "",
      imageUrl2: room.imageUrl2 || "",
      imageUrl3: room.imageUrl3 || "",
    });
  };

  const closeEdit = () => {
    setEditingRoom(null);
  };

  const onEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    const payload = {
      ...editingRoom,
      ...editForm,
      capacity:
        editForm.capacity === "" ? null : parseInt(editForm.capacity, 10),
      price: editForm.price === "" ? null : parseFloat(editForm.price),
      totalUnits:
        editForm.totalUnits === "" ? null : parseInt(editForm.totalUnits, 10),
    };

    try {
      const resp = await fetch(`${API_BASE}/api/rooms/${editingRoom.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Update failed:", resp.status, text);
        alert("Error updating room (status " + resp.status + ").");
        return;
      }

      const updated = await resp.json();

      setAllRooms((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setRooms((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      closeEdit();
    } catch (err) {
      console.error("Network / CORS error when updating room:", err);
      alert(
        "Network error when updating room. Please check that the backend is running."
      );
    }
  };

  return (
    <>
      {/* FILTRE – doar pentru Guest (nu și în EmployeeDashboard) */}
      {!showDelete && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Filter available rooms</h2>
            </div>
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            {/* Price filter */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}
              >
                Filter by price:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: 8,
                }}
              >
                <input
                  className="input"
                  placeholder="Min price"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Max price"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={applyPriceFilter}
                >
                  Apply price filter
                </button>
              </div>
            </div>

            {/* Advanced filter */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}
              >
                Advanced filter:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr auto",
                  gap: 8,
                }}
              >
                <input
                  className="input"
                  placeholder="Type (single, double, suite...)"
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Min capacity"
                  value={minCapacityInput}
                  onChange={(e) => setMinCapacityInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={applyAdvancedFilter}
                >
                  Apply advanced filter
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                className="btn"
                onClick={resetFilters}
                style={{ background: "#f3f4f6" }}
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* room cards */}
      <div className="room-grid">
        {rooms.map((room) => {
          const images = getImagesForRoom(room);
          const mainImage = images[0];
          const thumbs = images.slice(1);

          return (
            <div
              key={room.id}
              className="room-card room-card-clickable"
              onClick={() => openGallery(room)}
            >
              {showDelete && (
                <>
                  <button
                    className="room-delete-btn"
                    onClick={(e) => handleDelete(room.id, e)}
                  >
                    ✕
                  </button>
                  <button
                    className="room-edit-btn"
                    onClick={(e) => openEdit(room, e)}
                  >
                    Edit
                  </button>
                </>
              )}

              <img
                className="room-image"
                src={mainImage}
                alt={`Room ${room.number}`}
              />

              {thumbs.length > 0 && (
                <div className="room-thumbs">
                  {thumbs.map((img, idx) => (
                    <img
                      key={idx}
                      className="room-thumb"
                      src={img}
                      alt={`Room ${room.number} extra ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="room-body">
                <div>
                  <strong>Room #{room.number}</strong>
                  <div className="text-muted">
                    {room.type} · {room.capacity} guests
                  </div>
                  {typeof room.totalUnits === "number" && (
                    <div className="text-muted">
                      Total units: {room.totalUnits}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>{room.price} €/night</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* gallery modal */}
      {galleryOpen && (
        <div className="modal-overlay" onClick={closeGallery}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeGallery}>
              ×
            </button>
            <img
              className="modal-image"
              src={galleryImages[galleryIndex]}
              alt="Room"
            />
            {galleryImages.length > 1 && (
              <div className="modal-nav">
                <button onClick={prevImage}>‹</button>
                <span>
                  {galleryIndex + 1} / {galleryImages.length}
                </span>
                <button onClick={nextImage}>›</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* edit modal – la fel ca înainte, doar mai compact */}
      {editingRoom && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "640px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#0f172a",
              padding: "20px 20px 12px",
              borderRadius: "16px",
            }}
          >
            <button className="modal-close" onClick={closeEdit}>
              ×
            </button>

            <h3 style={{ marginBottom: 12 }}>
              Edit room #{editingRoom.number}
            </h3>

            <form onSubmit={saveEdit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <input
                  className="input"
                  placeholder="Room number"
                  value={editForm.number}
                  onChange={(e) => onEditChange("number", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Type (single, double...)"
                  value={editForm.type}
                  onChange={(e) => onEditChange("type", e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Capacity"
                  value={editForm.capacity}
                  onChange={(e) => onEditChange("capacity", e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="Price (€ / night)"
                  value={editForm.price}
                  onChange={(e) => onEditChange("price", e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Total units"
                  value={editForm.totalUnits}
                  onChange={(e) => onEditChange("totalUnits", e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                <input
                  className="input"
                  placeholder="Main image URL"
                  value={editForm.imageUrl}
                  onChange={(e) => onEditChange("imageUrl", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Image URL 2 (optional)"
                  value={editForm.imageUrl2}
                  onChange={(e) => onEditChange("imageUrl2", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Image URL 3 (optional)"
                  value={editForm.imageUrl3}
                  onChange={(e) => onEditChange("imageUrl3", e.target.value)}
                />
              </div>

              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  paddingTop: 8,
                  paddingBottom: 4,
                  background: "#0f172a",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEdit}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
