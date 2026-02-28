import React, { useState } from "react";
import { API_BASE } from "../App";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I'm your virtual assistant. How can I help with your stay?",
    },
  ]);

  // guest-ul salvat la login
  const user = JSON.parse(localStorage.getItem("user"));

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/api/support-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userId: user?.id || null,
        }),
      });

      if (!resp.ok) throw new Error("Network error");

      const answer = await resp.text();
      setMessages((prev) => [...prev, { from: "bot", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            "Sorry, I couldn't reach the support service. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open ? (
        <div className="chat-panel">
          <div className="chat-header">
            <span>Support chat</span>
            <button
              className="chat-close-btn"
              type="button"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message chat-${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-bot">Typing…</div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              className="chat-input"
              placeholder="Ask something about your stay..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="btn btn-primary chat-send"
              type="submit"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          className="chat-toggle-btn"
          type="button"
          onClick={() => setOpen(true)}
        >
          Need help?
        </button>
      )}
    </div>
  );
}
