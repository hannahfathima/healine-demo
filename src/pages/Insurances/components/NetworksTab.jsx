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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  fetchNetworks,
  fetchCompanies,
  createNetwork,
  updateNetwork,
  deleteNetwork,
} from "../../../apis/services/insuranceApi"; // Adjust path if needed
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
// 🔹 CHANGES MADE: search UI icons
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

const NetworksTab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  // CHANGES MADE: pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  // 🔹 CHANGES MADE: search state
  const [searchText, setSearchText] = useState("");

  const [companies, setCompanies] = useState([]); // For dropdown

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const columns = [
    { field: "name", headerName: "Network Name", flex: 1 },
    {
      field: "company_name",
      headerName: "Insurance Company",
      flex: 1,
      valueGetter: (params) => params.row.company?.name || "-",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <CustomIconButton
          key="view"
          onClickAction={() => navigate(`/network/${params.id}`)}
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

  // Load Networks
  // CHANGES MADE: server pagination applied
  const loadNetworks = useCallback(
    async (pageNo = page, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await fetchNetworks(pageNo, limit, searchText);

        if (res.data.success) {
          const mappedRows = res.data.data.rows.map((item) => ({
            id: item.id,
            name: item.name,
            company_id: item.company_id,
            company: item.company || null,
          }));

          setRows(mappedRows);
          setTotalRows(res.data.data.count);
        }
      } catch (err) {
        toast.error("Failed to load networks");
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


  // Load Companies for Select Dropdown
  const loadCompaniesForSelect = useCallback(async () => {
    try {
      const res = await fetchCompanies(); // This hits /insurance-company/select or list
      if (res.data.success) {
        // Adjust based on actual response structure
        const companyList = res.data.data?.rows || res.data.data || [];
        setCompanies(companyList);
      }
    } catch (err) {
      console.error("Failed to load companies", err);
      toast.error("Failed to load companies for selection");
    }
  }, []);
  // CHANGES MADE: reload when page/pageSize changes
  useEffect(() => {
    loadNetworks(page, pageSize);
    loadCompaniesForSelect();
  }, [page, pageSize, loadNetworks, loadCompaniesForSelect, searchText]);


  const handleEdit = (networkId) => {
    const network = rows.find((r) => r.id === networkId);
    if (network) {
      setId(networkId);
      setName(network.name);
      setCompanyId(network.company_id || "");
      setOpen(true);
    }
  };

  const handleDeleteClick = (networkId) => {
    setDeletingId(networkId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNetwork(deletingId);
      toast.success("Network deleted successfully");
      loadNetworks();
    } catch (err) {
      toast.error("Failed to delete network");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
    setName("");
    setCompanyId("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Network name is required");
      return;
    }
    if (!companyId) {
      toast.error("Please select an insurance company");
      return;
    }

    const payload = {
      name: name.trim(),
      company_id: Number(companyId),
    };

    try {
      if (id) {
        await updateNetwork(id, payload);
        toast.success("Network updated successfully");
      } else {
        await createNetwork(payload);
        toast.success("Network created successfully");
      }
      handleClose();
      loadNetworks();
    } catch (err) {
      console.error("Error saving network:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save network");
    }
  };
  // 🔹 OPTIONAL: prevent API spam
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [searchText]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {/* <Typography variant="h5">Insurance Networks</Typography> */}
        <TextField
          size="small"
          placeholder="Search Networks..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1); // reset pagination
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
          Add Network
        </Button>
      </div>

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalRows}
          paginationMode="server"

          // 🔹 CHANGES MADE: DataGrid uses 0-based page index
          page={page - 1}
          pageSize={pageSize}

          // 🔹 CHANGES MADE: dynamic rows-per-page options
          rowsPerPageOptions={getRowsPerPageOptions(totalRows)}

          onPageChange={(newPage) => setPage(newPage + 1)}

          // 🔹 CHANGES MADE: guard pageSize so it never exceeds totalRows
          onPageSizeChange={(newSize) => {
            const safeSize = Math.min(newSize, totalRows || newSize);
            setPageSize(safeSize);
            setPage(1); // reset to first page
          }}

          checkboxSelection
          density="compact"
          autoHeight
        />


      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {id ? "Edit Network" : "Add Network"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Insurance Company *</InputLabel>
            <Select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              label="Insurance Company *"
            >
              {companies.map((comp) => (
                <MenuItem key={comp.id} value={comp.id}>
                  {comp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Network Name *"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
        title="Delete Network"
        message="Are you sure you want to delete this insurance network?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
};

export default NetworksTab;