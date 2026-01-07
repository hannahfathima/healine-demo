import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";

import {
  fetchPrescriptions,
  fetchPrescriptionById,
  verifyPrescription,
} from "../../../apis/services/pillpackApi";

const PrescriptionsTab = () => {
  const navigate = useNavigate();
  const [fullRows, setFullRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  // =============================
  // LOAD PRESCRIPTIONS ✅ FIXED
  // =============================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchPrescriptions();

      // ✅ FIX 1: correct deep path
      const list = res?.data?.data?.data || [];

      const mappedRows = list.map((p) => ({
        id: p.id,

        // ✅ FIX 2: correct patient name
        patient: `${p.customer?.first_name || ""} ${
          p.customer?.last_name || ""
        }`,

        status: p.status,
        created_at: new Date(p.created_at).toLocaleDateString(),
      }));

      setFullRows(mappedRows);
      setRows(mappedRows);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = fullRows.filter((row) =>
      row.patient.toLowerCase().includes(searchText.toLowerCase())
    );
    setRows(filtered);
  }, [searchText, fullRows]);

  // =============================
  // OPEN VERIFY MODAL ✅ FIXED
  // =============================
  const openVerify = async (id) => {
    try {
      const res = await fetchPrescriptionById(id);

      // backend returns object directly
      setSelected(res?.data?.data || null);
      setNotes(res?.data?.data?.verification_notes || "");
      setOpen(true);
    } catch {
      toast.error("Failed to load prescription details");
    }
  };

  // =============================
  // VERIFY PRESCRIPTION
  // =============================
  const submitVerify = async () => {
    try {
      await verifyPrescription(selected.id, {
        status: "verified",
        verification_notes: notes,

        // medicines will come from backend OCR later
        medicines: [],
      });

      toast.success("Prescription verified");
      setOpen(false);
      loadData();
    } catch {
      toast.error("Verification failed");
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const columns = [
    { field: "patient", headerName: "Patient", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "created_at", headerName: "Date", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => navigate(`/pillpack/prescriptions/${params.id}`)}
            aria-label="View"
          >
            <RemoveRedEyeIcon />
          </IconButton>
          <Button size="small" onClick={() => openVerify(params.id)}>
            Verify
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <TextField
              label="Search Patient"
              onChange={handleSearchChange}
              value={searchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchText && (
                      <IconButton
                        onClick={() => setSearchText("")}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <DataGrid
        density="compact"
        autoHeight
        getRowHeight={() => "auto"}
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pagination
        pageSizeOptions={[5, 10, 25]}
      />

      {/* VERIFY DIALOG */}
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle>Verify Prescription</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Verification Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={submitVerify}>
            Confirm Verification
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionsTab;