// src/pages/BioMark/ViewBiomarker.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { getRecord } from "../../apis/services/CommonApiService";

const useStyles = makeStyles({
  label: {
    marginBottom: "11px",
    color: "#1E1E1E",
    fontSize: "16px",
    fontWeight: 500,
  },
  value: {
    color: "#000",
    paddingLeft: "5px",
    wordBreak: "break-word",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "20px",
    marginBottom: "20px",
    borderTop: "2px solid #e0e0e0",
    marginTop: "20px",
    paddingTop: "20px",
  },
  backBtn: {
    width: "98px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(180deg, #1e4060 0%, #122b40 100%)",
    },
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
});

function ViewBiomarker() {
  const classes = useStyles();
  const { id, type = "biomarker" } = useParams(); // "biomarker" | "group"
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const endpoint =
    type === "group" ? ApiEndPoints.BIOMARKER_GROUPS : ApiEndPoints.BIOMARKERS;

  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "-";

  const fetchDetail = useCallback(async () => {
    if (!id) {
      toast.error("Invalid ID");
      setTimeout(() => navigate(-1), 1000);
      return;
    }

    setLoading(true);
    try {
      const res = await getRecord(id, endpoint);
      if (res.status === 200) {
        setDetail(res.data);
      } else {
        toast.error(res.message || "Failed to load details");
        setTimeout(() => navigate(-1), 1000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      setTimeout(() => navigate(-1), 1000);
    } finally {
      setLoading(false);
    }
  }, [id, endpoint, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </div>
    );

  if (!detail) return null;

  const isGroup = type === "group";
  const biomarkers = Array.isArray(detail.biomarkers)
    ? detail.biomarkers
    : [];

  /* ------------------------------------------------------------------ */
  /*  Common fields (both biomarker & group)                            */
  /* ------------------------------------------------------------------ */
  const commonRows = [
    { label: "Name", value: detail.name },
    { label: "Description", value: detail.description || "No description" },
    { label: "Base Price (AED)", value: formatPrice(detail.base_price) },
    { label: "Selling Price (AED)", value: formatPrice(detail.selling_price) },
  ];

  /* ------------------------------------------------------------------ */
  /*  Biomarker-only fields                                             */
  /* ------------------------------------------------------------------ */
  const biomarkerRows = !isGroup
    ? [
      { label: "Significance", value: detail.significance },
      { label: "Type", value: detail.type },
      { label: "Specimen", value: detail.specimen },
      { label: "Unit", value: detail.unit },
      { label: "Category", value: detail.category },
      {
        label: "Fasting Required",
        value: detail.fasting_required ? "Yes" : "No",
      },
      {
        label: "Fasting Time (hrs)",
        value: detail.fasting_time_hours ?? "-",
      },
    ]
    : [];

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-width" style={{ padding: "1rem" }}>
      {/* Header */}
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid #e0e0e0", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">
          View {isGroup ? "Biomarker Group" : "Biomarker"}
        </h4>
      </div>

      {/* Main Grid */}
      <Grid container spacing={3} alignItems="flex-start">
        {/* Common fields */}
        {/* Image Display */}
        {detail.image && (
          <Grid item xs={12} sm={6}>
            <Typography className={classes.label}>Image</Typography>
            <Box mt={1} width={150} height={150}>
              {detail.image && !detail.image.endsWith("/null") ? (
                <img
                  src={detail.image}
                  alt={detail.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  height="100%"
                  border="1px solid #ddd"
                  borderRadius="8px"
                  bgcolor="#f5f5f5"
                >
                  <Typography variant="body2" color="textSecondary">
                    No image found
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        )}
        {commonRows.map((row, idx) => (
          <Grid item xs={12} sm={6} key={`common-${idx}`}>
            <Typography className={classes.label}>{row.label}</Typography>
            <Typography className={classes.value} variant="subtitle1">
              {row.value ?? "-"}
            </Typography>
          </Grid>
        ))}

        {/* Biomarker specific fields */}
        {biomarkerRows.map((row, idx) => (
          <Grid item xs={12} sm={6} key={`bio-${idx}`}>
            <Typography className={classes.label}>{row.label}</Typography>
            <Typography className={classes.value} variant="subtitle1">
              {row.value ?? "-"}
            </Typography>
          </Grid>
        ))}

        {/* Critical & Normal Ranges (only biomarker) */}
        {!isGroup && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.label}>Critical Range</Typography>
              <Typography className={classes.value}>
                {detail.critical_min ?? "-"} - {detail.critical_max ?? "-"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.label}>Normal Range</Typography>
              <Typography className={classes.value}>
                {detail.normal_min ?? "-"} - {detail.normal_max ?? "-"}
              </Typography>
            </Grid>
          </>
        )}

        {/* Biomarkers inside a Group */}
        {isGroup && biomarkers.length > 0 && (
          <Grid item xs={12}>
            <Typography className={classes.label} gutterBottom>
              Selected Biomarkers
            </Typography>

            <TableContainer component={Paper} elevation={2}>
              <Table size="small">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Specimen</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Unit</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price (AED)</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {biomarkers.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.id}</TableCell>
                      <TableCell>{b.name}</TableCell>
                      <TableCell>{b.type}</TableCell>
                      <TableCell>{b.specimen}</TableCell>
                      <TableCell>{b.unit}</TableCell>
                      <TableCell>{formatPrice(b.selling_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>

      {/* Back button */}
      <div className={classes.buttonWrapper}>
        <Button
          className={classes.backBtn}
          variant="contained"
          disableElevation
          onClick={() =>
            navigate(isGroup ? "/biomarker-groups" : "/biomarkers")
          }
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default ViewBiomarker;
