// src/pages/admin/components/ProductsTab.jsx
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategoriesSelect,
  fetchBrandsSelect,
} from "../../../apis/services/pharmacyApi";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
import { SearchIcon } from "lucide-react";

const ProductsTab = () => {
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
    description: "",
    base_price: "",
    selling_price: "",
    stock_global: "",
  });
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPrescriptionRequired, setIsPrescriptionRequired] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "category_name",
      headerName: "Category",
      flex: 1,
      valueGetter: (params) => params.row.category?.name || "-",
    },
    {
      field: "brand_name",
      headerName: "Brand",
      flex: 1,
      valueGetter: (params) => params.row.brand?.name || "-",
    },
    { field: "selling_price", headerName: "Selling Price", flex: 1 },
    { field: "stock_global", headerName: "Stock", flex: 1 },
    {
      field: "is_prescription_required",
      headerName: "Prescription Req.",
      flex: 1,
      type: "boolean",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <CustomIconButton
          key="view"
          onClickAction={() => navigate(`/pharmacy/product/${params.id}`)}
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

  const loadProducts = useCallback(
    async (pageNumber = page, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await fetchProducts(pageNumber, limit, searchText);
        if (res.data.success) {
          const mappedRows = res.data.data.rows.map((item) => ({
            id: item.id,
            name: item.name,
            category_id: item.category_id,
            category: item.category || null,
            brand_id: item.brand_id,
            brand: item.brand || null,
            description: item.description,
            base_price: item.base_price,
            selling_price: item.selling_price,
            is_prescription_required: item.is_prescription_required,
            stock_global: item.stock_global,
            image: item.image,
          }));
          setRows(mappedRows);
          setTotalRows(res.data.data.count);
        }
      } catch (err) {
        toast.error("Failed to load products");
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

  const loadSelects = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetchCategoriesSelect(),
        fetchBrandsSelect(),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data || []);
      if (brandRes.data.success) setBrands(brandRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load selects");
    }
  }, []);

  useEffect(() => {
    loadProducts(page, pageSize);
    loadSelects();
  }, [loadProducts, loadSelects]);

  const handleEdit = (id) => {
    const product = rows.find((r) => r.id === id);
    if (product) {
      setId(id);
      setFormData({
        name: product.name,
        description: product.description || "",
        base_price: product.base_price || "",
        selling_price: product.selling_price || "",
        stock_global: product.stock_global || "",
      });
      setBrandId(product.brand_id || "");
      setCategoryId(product.category_id || "");
      setIsPrescriptionRequired(product.is_prescription_required || false);
      setPreviewImage(product.image ? `${product.image}` : null);
      setImageFile(null);
      setOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deletingId);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
    setFormData({
      name: "",
      description: "",
      base_price: "",
      selling_price: "",
      stock_global: "",
    });
    setBrandId("");
    setCategoryId("");
    setIsPrescriptionRequired(false);
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Product name is required.");
      return;
    }
    if (!categoryId || !brandId) {
      toast.error("Brand and category are required.");
      return;
    }
    if (isNaN(formData.base_price) || isNaN(formData.selling_price) || isNaN(formData.stock_global)) {
      toast.error("Valid prices and stock are required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", trimmedName);
    payload.append("brand_id", brandId);
    payload.append("category_id", categoryId);
    payload.append("description", formData.description || "");
    payload.append("base_price", formData.base_price);
    payload.append("selling_price", formData.selling_price);
    payload.append("is_prescription_required", isPrescriptionRequired.toString());
    payload.append("stock_global", formData.stock_global);
    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      let response;
      if (id) {
        const isMultipart = !!imageFile;
        response = await updateProduct(id, payload, isMultipart);
        toast.success("Product updated successfully");
      } else {
        response = await createProduct(payload);
        toast.success("Product created successfully");
      }
      handleClose();
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
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
          Add Product
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {id ? "Edit Product" : "Add Product"}
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
            label="Product Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Brand *</InputLabel>
            <Select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              label="Brand *"
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category *</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category *"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              label="Base Price"
              type="number"
              fullWidth
              margin="normal"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
            />
            <TextField
              label="Selling Price"
              type="number"
              fullWidth
              margin="normal"
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
            />
          </div>
          <TextField
            label="Global Stock"
            type="number"
            fullWidth
            margin="normal"
            value={formData.stock_global}
            onChange={(e) => setFormData({ ...formData, stock_global: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPrescriptionRequired}
                onChange={(e) => setIsPrescriptionRequired(e.target.checked)}
              />
            }
            label="Prescription Required"
          />
          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2" gutterBottom>
              Image
            </Typography>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {(previewImage || imageFile) && (
              <img
                src={previewImage}
                alt="Image preview"
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
        title="Delete Product"
        message="Are you sure you want to delete this pharmacy product?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
};

export default ProductsTab;