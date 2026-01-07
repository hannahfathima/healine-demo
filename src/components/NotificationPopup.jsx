// src/components/NotificationPopup.jsx
import React, { useEffect, useState } from "react";
import "./NotificationPopup.css"; // Make sure to create this CSS file for styling

export default function NotificationPopup({ notification }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notification) {
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  }, [notification]);

  if (!show) return null;

  return (
    <div className="popup-notification">
      <h4>{notification.title}</h4>
      <p>{notification.body}</p>
 </div>
);
}
