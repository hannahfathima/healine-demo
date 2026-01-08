import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

import {
  fetchInsuranceCategories,
  INSURANCE_CATEGORY,
} from "../../../apis/services/insuranceApi";

import axios from "axios";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
// 🔹 CHANGES MADE
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";


export default function InsuranceCategoriesTab() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  // 🔹 CHANGES MADE
  const [searchText, setSearchText] = useState("");

  const [id, setId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [iconFile, setIconFile] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // 🔹 CHANGES MADE: pagination state (client-side)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalRows = rows.length;

  // ---------------------------------------
  // ⭐ FIX: Load specialities rows correctly
  // ---------------------------------------
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchInsuranceCategories();
      if (res.data.success) {
        const list = res.data.data?.rows || [];
        const mapped = list.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          icon_url: item.icon,
        }));
        setRows(mapped);
      }
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  // 🔹 CHANGES MADE: client-side filtering
  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (row.description || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // ---------------------------------------
  // ⭐ Table Columns (Same style as Companies)
  // ---------------------------------------
  const columns = [
    {
      field: "icon_url",
      headerName: "Icon",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="icon"
            style={{ height: 40, width: 40, borderRadius: 6 }}
          />
        ) : (
          "No Icon"
        ),
    },
    { field: "name", headerName: "Speciality Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <CustomIconButton
          key="edit"
          onClickAction={() => handleEdit(params.id)}
          arialLabel="edit"
          icon={<EditIcon />}
        />,
        <CustomIconButton
          key="delete"
          onClickAction={() => handleDeleteClick(params.id)}
          arialLabel="delete"
          icon={<DeleteIcon />}
        />,
      ],
    },
  ];
  // 🔹 CHANGES MADE: dynamic rows-per-page options
  const getRowsPerPageOptions = (count) => {
    if (count <= 10) return [10];
    if (count <= 20) return [10, 20];
    if (count <= 50) return [10, 25, 50];

    // count > 50
    return [10, 25, 50, 100];
  };


  // ---------------------------------------
  // ⭐ EDIT existing item
  // ---------------------------------------
  const handleEdit = (id) => {
    const item = rows.find((r) => r.id === id);
    if (item) {
      setId(id);
      setFormData({
        name: item.name,
        description: item.description,
      });
      setPreviewIcon(item.icon_url);
      setIconFile(null);
      setOpen(true);
    }
  };

  // ---------------------------------------
  // ⭐ DELETE: Confirm Dialog
  // ---------------------------------------
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(INSURANCE_CATEGORY.DELETE(deletingId));
      toast.success("Speciality deleted successfully");
      loadCategories();
    } catch (err) {
      toast.error("Failed to delete speciality");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  // ---------------------------------------
  // ⭐ Close modal & reset form
  // ---------------------------------------
  const handleClose = () => {
    setOpen(false);
    setId(null);
    setFormData({ name: "", description: "" });
    setIconFile(null);
    setPreviewIcon(null);
  };

  // ---------------------------------------
  // ⭐ Add / Update Speciality
  // ---------------------------------------
  const handleSubmit = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Speciality name is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", trimmedName);
    payload.append("description", formData.description || "");

    if (iconFile) {
      payload.append("icon", iconFile);
    }

    try {
      if (id) {
        await axios.put(INSURANCE_CATEGORY.UPDATE(id), payload);
        toast.success("Speciality updated successfully");
      } else {
        await axios.post(INSURANCE_CATEGORY.CREATE, payload);
        toast.success("Speciality created successfully");
      }

      handleClose();
      loadCategories();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to save speciality";
      toast.error(msg);
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ---------------------------------------
  // ⭐ UI / JSX
  // ---------------------------------------
  return (
    <>
      {/* Add Button (same layout as companies) */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {/* ===============================
    🔹 SPECIALITY SEARCH
================================ */}
        <TextField
          size="small"
          placeholder="Search Specialities..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 2, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchText("");
                    setPage(1);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Speciality
        </Button>
      </div>

      {/* Table */}
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}

          // 🔹 CHANGES MADE: client-side pagination
          page={page - 1}          // DataGrid is 0-based
          pageSize={pageSize}
          rowCount={filteredRows.length}

          // 🔹 CHANGES MADE: dynamic rowsPerPageOptions
          rowsPerPageOptions={getRowsPerPageOptions(totalRows)}

          onPageChange={(newPage) => setPage(newPage + 1)}

          // 🔹 CHANGES MADE: prevent invalid page size
          onPageSizeChange={(newSize) => {
            const safeSize = Math.min(newSize, totalRows || newSize);
            setPageSize(safeSize);
            setPage(1);
          }}

          pagination
          density="compact"
          autoHeight
        />

      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {id ? "Edit Speciality" : "Add Speciality"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Speciality Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2" gutterBottom>
              Speciality Icon
            </Typography>
            <input type="file" accept="image/*" onChange={handleIconChange} />

            {(previewIcon || iconFile) && (
              <img
                src={previewIcon}
                alt="preview"
                style={{ marginTop: 10, maxHeight: 120, borderRadius: 8 }}
              />
            )}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        openDialog={deleteDialogOpen}
        title="Delete Speciality"
        message="Are you sure you want to delete this speciality?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
}
