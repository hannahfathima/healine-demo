// src/hooks/useAdminNotifications.js
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import instance from "../apis/ApiConfig";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const baseURL = process.env.REACT_APP_BASE_URL;

/* ======================================================
   🔥 GLOBAL SOCKET (SINGLETON)
====================================================== */
let adminSocket = null;

function getAdminSocket(token) {
  if (!adminSocket) {
    adminSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      auth: { token },
    });

    console.log("🧠 Admin socket created (singleton)");
  }

  return adminSocket;
}

/* ======================================================
   HOOK
====================================================== */
export default function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const auth = useSelector((state) => state.auth);
  const token = auth?.userInfo?.token;
  const isLoggedIn = !!token;

  /* =====================
     MARK AS READ
  ===================== */
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await instance.put(`${baseURL}admin-notifications/${id}/read`);
    } catch (err) {
      console.error("❌ markAsRead failed", err);
    }
  }, []);

  /* =====================
     EFFECT
  ===================== */
  useEffect(() => {
    if (!isLoggedIn) {
      console.log("⚠️ Not logged in — skipping socket");
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    /* ---------- Fetch notifications ---------- */
    const fetchNotifications = async () => {
      try {
        const res = await instance.get(`${baseURL}admin-notifications`);
        if (res.data.ResponseCode === 1) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.data.filter((n) => !n.isRead).length);
        }
      } catch (e) {
        console.error("❌ Fetch notifications failed", e);
      }
    };

    fetchNotifications();

    /* ---------- Socket ---------- */
    const socket = getAdminSocket(token);

    const onConnect = () => {
      console.log("✅ Admin socket connected:", socket.id);
      socket.emit("join_admin_room");
    };

    const onDoctorBooking = (data) => pushNotification(data);
    const onPackageBooking = (data) => pushNotification(data);

    socket.on("connect", onConnect);
    socket.on("admin_notification", (data) => {
      console.log("📩 Admin Notification:", data);
      pushNotification(data);
    });


    function pushNotification(data) {
      const entry = {
        id: Date.now(),
        ...data,
        isRead: false,
        created_at: new Date(),
      };

      setNotifications((prev) => [entry, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setNewNotification(entry);

      new Audio("/Healine_Notification.mp3").play().catch(() => {});
    }

    /* ---------- CLEANUP (NO DISCONNECT) ---------- */
    return () => {
      console.log("🧹 Removing socket listeners");
      socket.off("connect", onConnect);
      socket.off("doctor_booking", onDoctorBooking);
      socket.off("package_booking", onPackageBooking);
    };
  }, [isLoggedIn, token]);

  return {
    notifications,
    newNotification,
    unreadCount,
    setUnreadCount,
    markAsRead,
  };
}
