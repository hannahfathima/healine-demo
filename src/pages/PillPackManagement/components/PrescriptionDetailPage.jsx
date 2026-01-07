import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { fetchPrescriptionById } from "../../../apis/services/pillpackApi";

const PrescriptionDetailPage = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Image preview dialog (UNCHANGED)
  const [previewOpen, setPreviewOpen] = useState(false);

  // 🔹 NEW: PDF detection ONLY
  const isPdf =
    prescription?.prescription_file?.toLowerCase().endsWith(".pdf");

  const getPrescriptionDetail = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const result = await fetchPrescriptionById(id);
        if (result.data.success) {
          setPrescription(result.data.data);
        } else {
          toast.error("Failed to fetch prescription details");
          navigate("/pillpack-management");
        }
      } catch (error) {
        toast.error("Failed to fetch prescription details");
        navigate("/pillpack-management");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (prescriptionId) {
      getPrescriptionDetail(prescriptionId);
    }
  }, [prescriptionId, getPrescriptionDetail]);

  if (loading) return <div>Loading...</div>;
  if (!prescription) return null;

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">View Prescription</h4>
      </div>

      <Grid container spacing={2} alignItems="flex-start">
        {/* ================= Prescription File ================= */}
        <Grid item lg={12}>
          <Typography
            className="label"
            style={{
              marginBottom: "11px",
              color: "#1E1E1E",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Prescription File
          </Typography>

          {/* 🔹 ONLY PDF LOGIC ADDED – IMAGE UI SAME */}
          {prescription.prescription_file && (
            <>
              {isPdf ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    window.open(
                      prescription.prescription_file,
                      "_blank"
                    )
                  }
                  style={{
                    background:
                      "linear-gradient(180deg, #255480 0%, #173450 100%)",
                  }}
                >
                  View PDF
                </Button>
              ) : (
                <img
                  src={prescription.prescription_file}
                  alt="Prescription"
                  onClick={() => setPreviewOpen(true)}
                  style={{
                    height: "200px",
                    width: "auto",
                    borderRadius: "8px",
                    objectFit: "contain",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </>
          )}
        </Grid>

        {/* ================= Patient Details (UNCHANGED) ================= */}
        <Grid item lg={6}>
          <Typography className="label">Patient</Typography>
          <Typography className="value">
            {prescription.customer?.first_name}{" "}
            {prescription.customer?.last_name}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Email</Typography>
          <Typography className="value">
            {prescription.customer?.email || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Mobile</Typography>
          <Typography className="value">
            {prescription.customer?.mobile_no || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Doctor Name</Typography>
          <Typography className="value">
            {prescription.doctor_name || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Prescription Date</Typography>
          <Typography className="value">
            {prescription.prescription_date || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Expiry Date</Typography>
          <Typography className="value">
            {prescription.expiry_date || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Status</Typography>
          <Typography className="value">{prescription.status}</Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Verification Notes</Typography>
          <Typography className="value">
            {prescription.verification_notes || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Verified At</Typography>
          <Typography className="value">
            {prescription.verified_at
              ? new Date(prescription.verified_at).toLocaleString()
              : "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Created At</Typography>
          <Typography className="value">
            {new Date(prescription.created_at).toLocaleString()}
          </Typography>
        </Grid>

        {/* ================= Medicines (UNCHANGED) ================= */}
        <Grid item lg={12}>
          <Typography className="label">Medicines</Typography>
          <List>
            {prescription.medicines.map((med, index) => (
              <div key={med.id}>
                <ListItem>
                  <ListItemText
                    primary={med.medicine_name}
                    secondary={`Dosage: ${med.dosage || "-"} | Frequency: ${
                      med.frequency || "-"
                    } | Status: ${med.status}`}
                  />
                </ListItem>
                {index < prescription.medicines.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Grid>
      </Grid>

      {/* ================= Back Button ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginRight: "20px",
          marginBottom: "20px",
          borderTop: "2px solid",
          marginTop: "20px",
          paddingTop: "20px",
        }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={() => navigate("/pillpack-management")}
          style={{
            width: "98px",
            height: "44px",
            background:
              "linear-gradient(180deg, #255480 0%, #173450 100%)",
          }}
        >
          Back
        </Button>
      </div>

      {/* ================= IMAGE PREVIEW DIALOG (UNCHANGED) ================= */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
      >
        <IconButton
          onClick={() => setPreviewOpen(false)}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={prescription.prescription_file}
          alt="Preview"
          style={{
            maxWidth: "100%",
            maxHeight: "90vh",
            objectFit: "contain",
            padding: "20px",
          }}
        />
      </Dialog>
    </div>
  );
};

export default PrescriptionDetailPage;
