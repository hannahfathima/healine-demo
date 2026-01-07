// src/pages/Notifications.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAdminNotifications from "../hooks/useAdminNotification";

export default function NotificationsPage() {
  const { notifications, markAsRead } = useAdminNotifications();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>All Notifications</h2>

      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => {
            if (!n.isRead) markAsRead(n.id);
            navigate(`/notifications/${n.id}`, { state: n });
          }}
          style={{
            padding: 16,
            marginBottom: 12,
            cursor: "pointer",
            background: n.isRead ? "#fff" : "#f1f8f6",
            borderLeft: "4px solid #10ab80",
          }}
        >
          <strong>{n.title}</strong>
          <p>{n.body}</p>
        </div>
      ))}
    </div>
  );
}
