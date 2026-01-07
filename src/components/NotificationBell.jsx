// src/components/NotificationBell.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Button, Typography, Box } from "@mui/material";

export default function NotificationBell({
  unreadCount,
  notifications,
  markAsRead,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }

    setAnchorEl(null);

    // Redirect to notification details
    navigate(`/notifications`, { state: n });
  };

  // ⭐ Filter to show only unread notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <>
      <Badge
        badgeContent={unreadCount}
        color="error"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ cursor: "pointer", padding: "5px", zIndex: 0 }}
      >
        <NotificationsIcon
          sx={{
            fontSize: 28,
            color: "primary.main",
          }}
        />
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ style: { width: 380, maxHeight: 500 } }}
      >
        {/* ===================== */}
        {/* 🔹 CHANGE: Styled View All */}
        {/* ===================== */}
        {unreadNotifications.length === 0 && (
          <MenuItem disableRipple>
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <Button
                component={Link}
                to="/notifications"
                fullWidth
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  background:
                    "linear-gradient(180deg, #255480 0%, #173450 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, #173450 0%, #255480 100%)",
                      color: "#fff",
                  },
                }}
                onClick={() => setAnchorEl(null)}
              >
                View All Notifications
              </Button>
            </Box>
          </MenuItem>
        )}

        {/* ===================== */}
        {/* 🔹 Notification Items */}
        {/* ===================== */}
        {unreadNotifications.slice(0, 10).map((n) => (
          <div key={n.id}>
            <MenuItem
              onClick={() => handleNotificationClick(n)}
              sx={{
                backgroundColor: "#e8f5e9",
                borderLeft: "4px solid #10ab80",
                "&:hover": {
                  backgroundColor: "#c8e6c9",
                },
              }}
            >
              <div>
                <strong>{n.title}</strong>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  {n.body}
                </p>
                <small style={{ color: "#666" }}>
                  {new Date(n.created_at).toLocaleString()}
                </small>
              </div>
            </MenuItem>
            <Divider />
          </div>
        ))}
      </Menu>
    </>
  );
}
