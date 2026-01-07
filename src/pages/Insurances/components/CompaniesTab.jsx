import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../../apis/services/insuranceApi"; // Adjust path as needed
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
import { SearchIcon } from "lucide-react";

const CompaniesTab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // 🔹 CHANGES MADE: search state
  const [searchText, setSearchText] = useState("");

  const [id, setId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contact_number: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const columns = [
    {
      field: "logo_url",
      headerName: "Logo",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="logo"
            style={{ height: 40, borderRadius: 4, objectFit: "contain" }}
          />
        ) : (
          "No Logo"
        ),
    },
    { field: "name", headerName: "Company Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact_number", headerName: "Contact", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <CustomIconButton
          key="view"
          onClickAction={() => navigate(`/company/${params.id}`)}
          arialLabel="view"
          icon={<VisibilityIcon />}
        />,
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

  // CHANGES MADE: accept page & pageSize
  // CHANGES MADE: pass correct pagination params
  const loadCompanies = useCallback(
    async (pageNumber = page, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await fetchCompanies(pageNumber, limit, searchText); // ✅ FIXED

        if (res.data.success) {
          const mappedRows = res.data.data.rows.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email || "-",
            contact_number: item.contact_number || "-",
            description: item.description || "-",
            logo_url: item.logo_url,
          }));

          setRows(mappedRows);
          setTotalRows(res.data.data.count); // ✅ total records from backend
        }
      } catch (err) {
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );
  // 🔹 CHANGES MADE: dynamic rows-per-page options based on backend count
  const getRowsPerPageOptions = (count) => {
    if (count <= 10) return [10];

    if (count <= 20) return [10, 20];

    if (count <= 50) return [10, 25, 50];

    // count > 50 → allow up to 100
    return [10, 25, 50, 100];
  };

  // CHANGES MADE: depend on page & pageSize
  // CHANGES MADE: reload when page or pageSize changes
  useEffect(() => {
    loadCompanies(page, pageSize);
  }, [page, pageSize, searchText]);


  const handleEdit = (id) => {
    const company = rows.find((r) => r.id === id);
    if (company) {
      setId(id);
      setFormData({
        name: company.name,
        description: company.description,
        email: company.email === "-" ? "" : company.email,
        contact_number: company.contact_number === "-" ? "" : company.contact_number,
      });
      setPreviewLogo(company.logo_url);
      setLogoFile(null);
      setOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompany(deletingId);
      toast.success("Company deleted successfully");
      loadCompanies();
    } catch (err) {
      toast.error("Failed to delete company");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
    setFormData({ name: "", description: "", email: "", contact_number: "" });
    setLogoFile(null);
    setPreviewLogo(null);
  };

  const handleSubmit = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Company name is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", trimmedName);
    payload.append("description", formData.description || "");
    payload.append("email", formData.email || "");
    payload.append("contact_number", formData.contact_number || "");

    // CRITICAL: Use exact field name from backend
    if (logoFile) {
      payload.append("logo_url", logoFile);  // ← MUST be "logo_url"
    }

    // DEBUG LOGS
    console.log("🚀 Final FormData being sent:");
    for (let [key, value] of payload.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File → ${value.name} (${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      let response;
      if (id) {
        // For update: use multipart only if file is present
        const isMultipart = !!logoFile;
        response = await updateCompany(id, payload, isMultipart);
        toast.success("Company updated successfully");
      } else {
        response = await createCompany(payload);
        toast.success("Company created successfully");
      }

      console.log("✅ SUCCESS:", response.data);
      handleClose();
      loadCompanies();
    } catch (err) {
      console.error("❌ FAILED:", err.response?.data || err);
      const msg = err.response?.data?.message || "Failed to save company";
      toast.error(msg);
    }
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [searchText]);

  return (
    <>
   

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {/* <Typography variant="h5">Insurance Companies</Typography> */}
           <TextField style={{width:"30%"}}
        size="small"
        placeholder="Search..."
        value={searchText}
        fullWidth
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1); // reset pagination
        }}
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
                  setPage(1); // reset page
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Company
        </Button>
      </div>

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalRows}          // ✅ backend count
          paginationMode="server"
          page={page - 1}               // ✅ DataGrid is 0-based
          pageSize={pageSize}

          // 🔹 CHANGES MADE: dynamic rowsPerPageOptions
          rowsPerPageOptions={getRowsPerPageOptions(totalRows)}

          onPageChange={(newPage) => setPage(newPage + 1)}

          // 🔹 CHANGES MADE: guard pageSize so it never exceeds totalRows
          onPageSizeChange={(newSize) => {
            const safeSize = Math.min(newSize, totalRows || newSize);
            setPageSize(safeSize);
            setPage(1);                 // ✅ reset to first page
          }}

          checkboxSelection
          density="compact"
          autoHeight
        />


      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {id ? "Edit Company" : "Add Company"}
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
            label="Company Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
          />

          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2" gutterBottom>
              Company Logo
            </Typography>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            {(previewLogo || logoFile) && (
              <img
                src={previewLogo}
                alt="Logo preview"
                style={{ marginTop: 10, maxHeight: 150, borderRadius: 8 }}
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
        title="Delete Company"
        message="Are you sure you want to delete this insurance company?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
};

export default CompaniesTab;