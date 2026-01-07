// src/pages/NotificationDetail.jsx

import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";

/* ========================= */
/* 🔹 Styles (same pattern) */
/* ========================= */
const useStyles = makeStyles({
  label: {
    marginBottom: "8px",
    color: "#1E1E1E",
    fontSize: "16px",
    fontWeight: "500",
  },
  value: {
    color: "#000",
    paddingLeft: "4px",
    fontSize: "15px",
  },
  header: {
    borderBottom: "2px solid",
    marginBottom: "20px",
    paddingBottom: "10px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "end",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "2px solid",
  },
  backBtn: {
    width: "98px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
  },
});

export default function NotificationDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  if (!state) {
    return <Typography>Notification not found</Typography>;
  }

  /* 🔹 CHANGE: Safe metadata extraction */
  const metadata = state.metadata || {};

  return (
    <div className="min-width">
      {/* ================= HEADER ================= */}
      <div className={classes.header}>
        <Typography variant="h6">View Notification Detail</Typography>
      </div>

      {/* ================= DETAILS GRID ================= */}
      <Grid container spacing={2} alignItems="flex-start">
        {/* Title */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Title</Typography>
          <Typography className={classes.value}>
            {state.title}
          </Typography>
        </Grid>

        {/* Message */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Message</Typography>
          <Typography className={classes.value}>
            {state.body}
          </Typography>
        </Grid>

        {/* Type */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Type</Typography>
          <Typography className={classes.value}>
            {state.type}
          </Typography>
        </Grid>

        {/* Patient Name */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Name</Typography>
          <Typography className={classes.value}>
            {metadata.patientName || "-"}
          </Typography>
        </Grid>

        {/* Doctor Name */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Doctor Name</Typography>
          <Typography className={classes.value}>
            {metadata.doctorName || "-"}
          </Typography>
        </Grid>

        {/* Hospital */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Hospital</Typography>
          <Typography className={classes.value}>
            {metadata.hospitalName || "-"}
          </Typography>
        </Grid>

        {/* Booking ID */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Booking ID</Typography>
          <Typography className={classes.value}>
            {metadata.bookingId || "-"}
          </Typography>
        </Grid>

        {/* Date */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Date</Typography>
          <Typography className={classes.value}>
            {metadata.formattedDate || "-"}
          </Typography>
        </Grid>

        {/* Time */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Slot</Typography>
          <Typography className={classes.value}>
            {metadata.time || "-"}
          </Typography>
        </Grid>

        {/* Phone */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Phone</Typography>
          <Typography className={classes.value}>
            {metadata.patientPhone || "-"}
          </Typography>
        </Grid>

        {/* Status */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Status</Typography>
          <Typography className={classes.value}>
            {state.status}
          </Typography>
        </Grid>

        {/* Created At */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Created At</Typography>
          <Typography className={classes.value}>
            {new Date(state.created_at).toLocaleString()}
          </Typography>
        </Grid>
      </Grid>

      {/* ================= FOOTER ================= */}
      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          className={classes.backBtn}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
