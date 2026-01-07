// src/pages/admin/components/CategoriesTab.jsx
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
  FormControlLabel,
  Checkbox,
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
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../apis/services/pharmacyApi";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
import { SearchIcon } from "lucide-react";

const CategoriesTab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [id, setId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sort_order: "",
  });
  const [isQuickLink, setIsQuickLink] = useState(false);
  const [iconFile, setIconFile] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const columns = [
    { field: "name", headerName: "Category Name", flex: 1 },
    { field: "is_quick_link", headerName: "Quick Link", flex: 1, type: "boolean" },
    { field: "sort_order", headerName: "Sort Order", flex: 1 },
 {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="icon"
            style={{ height: 40, borderRadius: 4, objectFit: "contain" }}
          />
        ) : (
          "No Icon"
        ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        // <CustomIconButton
        //   key="view"
        //   onClickAction={() => navigate(`/category/${params.id}`)}
        //   arialLabel="view"
        //   icon={<VisibilityIcon />}
        // />,
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

  const loadCategories = useCallback(
    async (pageNumber = page, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await fetchCategories(pageNumber, limit, searchText);
        if (res.data.success) {
          const mappedRows = res.data.data.rows.map((item) => ({
            id: item.id,
            name: item.name,
            is_quick_link: item.is_quick_link,
            sort_order: item.sort_order,
            icon: item.icon,
          }));
          setRows(mappedRows);
          setTotalRows(res.data.data.count);
        }
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );

  const getRowsPerPageOptions = (count) => {
    if (count <= 10) return [10];
    if (count <= 20) return [10, 20];
    if (count <= 50) return [10, 25, 50];
    return [10, 25, 50, 100];
  };

  useEffect(() => {
    loadCategories(page, pageSize);
  }, [loadCategories]);

  const handleEdit = (id) => {
    const category = rows.find((r) => r.id === id);
    if (category) {
      setId(id);
      setFormData({
        name: category.name,
        sort_order: category.sort_order || "",
      });
      setIsQuickLink(category.is_quick_link || false);
      setPreviewIcon(category.icon ? `${category.icon}` : null);
      setIconFile(null);
      setOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deletingId);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
    setFormData({ name: "", sort_order: "" });
    setIsQuickLink(false);
    setIconFile(null);
    setPreviewIcon(null);
  };

  const handleSubmit = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }
    if (!formData.sort_order || isNaN(formData.sort_order)) {
      toast.error("Valid sort order is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", trimmedName);
    payload.append("is_quick_link", isQuickLink.toString());
    payload.append("sort_order", formData.sort_order);
    if (iconFile) {
      payload.append("icon", iconFile);
    }

    try {
      let response;
      if (id) {
        const isMultipart = !!iconFile;
        response = await updateCategory(id, payload, isMultipart);
        toast.success("Category updated successfully");
      } else {
        response = await createCategory(payload);
        toast.success("Category created successfully");
      }
      handleClose();
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
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

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [searchText]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchText}
          fullWidth
          style={{ width: "30%" }}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
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
          Add Category
        </Button>
      </div>
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalRows}
          paginationMode="server"
          page={page - 1}
          pageSize={pageSize}
          rowsPerPageOptions={getRowsPerPageOptions(totalRows)}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newSize) => {
            const safeSize = Math.min(newSize, totalRows || newSize);
            setPageSize(safeSize);
            setPage(1);
          }}
          checkboxSelection
          density="compact"
          autoHeight
        />
      </div>
      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {id ? "Edit Category" : "Add Category"}
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
            label="Category Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Sort Order"
            type="number"
            fullWidth
            margin="normal"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isQuickLink}
                onChange={(e) => setIsQuickLink(e.target.checked)}
              />
            }
            label="Quick Link"
          />
          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2" gutterBottom>
              Icon
            </Typography>
            <input type="file" accept="image/*" onChange={handleIconChange} />
            {(previewIcon || iconFile) && (
              <img
                src={previewIcon}
                alt="Icon preview"
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
        title="Delete Category"
        message="Are you sure you want to delete this pharmacy category?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
};

export default CategoriesTab;