// src/pages/admin/components/InventoryTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
    fetchInventory,
    createInventory,
    updateInventory,
    deleteInventory,
    fetchProductsSelect,
    fetchEstablishmentsSelect,
} from "../../../apis/services/pharmacyApi";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
import { SearchIcon } from "lucide-react";

const InventoryTab = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    
    // Single source of truth for form + edit mode
    const [editingId, setEditingId] = useState(null); // null = add mode, number = edit mode
    const [formData, setFormData] = useState({
        productId: "",
        pharmacyId: "",
        stock: "",
        price: "",
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [products, setProducts] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);

    const columns = [
        {
            field: "product_name",
            headerName: "Product",
            flex: 1,
            valueGetter: (params) => params.row.product?.name || "-",
        },
        {
            field: "pharmacy_name",
            headerName: "Pharmacy",
            flex: 1,
            valueGetter: (params) => params.row.pharmacy?.name || "-",
        },
        { field: "stock", headerName: "Stock", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            getActions: (params) => [
                <CustomIconButton
                    key="edit"
                    onClickAction={() => handleEdit(params.id)}
                    ariaLabel="edit"
                    icon={<EditIcon />}
                />,
                <CustomIconButton
                    key="delete"
                    onClickAction={() => handleDeleteClick(params.id)}
                    ariaLabel="delete"
                    icon={<DeleteIcon />}
                />,
            ],
        },
    ];

    const loadInventory = useCallback(
        async (pageNumber = page, limit = pageSize) => {
            setLoading(true);
            try {
                const res = await fetchInventory(pageNumber, limit, searchText);
                if (res.data.success) {
                    const mappedRows = res.data.data.rows.map((item) => ({
                        id: item.id,
                        product_id: item.product_id,
                        product: item.product || null,
                        pharmacy_id: item.pharmacy_id,
                        pharmacy: item.pharmacy || null,
                        stock: item.stock,
                        price: item.price,
                    }));
                    setRows(mappedRows);
                    setTotalRows(res.data.data.count);
                }
            } catch (err) {
                toast.error("Failed to load inventory");
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
            const [prodRes, estRes] = await Promise.all([
                fetchProductsSelect(),
                fetchEstablishmentsSelect(),
            ]);
            if (prodRes.data.success) setProducts(prodRes.data.data || []);
            if (estRes.data.success) setPharmacies(estRes.data.data || []);
        } catch (err) {
            toast.error("Failed to load selects");
        }
    }, []);

    useEffect(() => {
        loadInventory();
        loadSelects();
    }, [loadInventory, loadSelects]);

    const handleEdit = (id) => {
        const item = rows.find((r) => r.id === id);
        if (item) {
            setEditingId(id);
            setFormData({
                productId: item.product_id || "",
                pharmacyId: item.pharmacy_id || "",
                stock: item.stock || "",
                price: item.price || "",
            });
            setOpen(true);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            productId: "",
            pharmacyId: "",
            stock: "",
            price: "",
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setFormData({
            productId: "",
            pharmacyId: "",
            stock: "",
            price: "",
        });
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteInventory(deletingId);
            toast.success("Inventory item deleted successfully");
            loadInventory();
        } catch (err) {
            toast.error("Failed to delete inventory item");
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const handleSubmit = async () => {
        const { productId, pharmacyId, stock, price } = formData;

        if (!productId || !pharmacyId) {
            toast.error("Product and pharmacy are required.");
            return;
        }
        if (isNaN(stock) || isNaN(price) || stock === "" || price === "") {
            toast.error("Valid stock and price are required.");
            return;
        }

        const payload = {
            product_id: Number(productId),
            pharmacy_id: Number(pharmacyId),
            stock: Number(stock),
            price: Number(price),
        };

        try {
            if (editingId) {
                await updateInventory(editingId, payload);
                toast.success("Inventory updated successfully");
            } else {
                await createInventory(payload);
                toast.success("Inventory created successfully");
            }
            handleClose();
            loadInventory();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save inventory");
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
                <Button variant="outlined" onClick={handleAdd}>
                    Add Inventory
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

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingId ? "Edit Inventory" : "Add Inventory"}
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
                        <InputLabel>Product *</InputLabel>
                        <Select
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            label="Product *"
                        >
                            {products.map((prod) => (
                                <MenuItem key={prod.id} value={prod.id}>
                                    {prod.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Pharmacy *</InputLabel>
                        <Select
                            value={formData.pharmacyId}
                            onChange={(e) => setFormData({ ...formData, pharmacyId: e.target.value })}
                            label="Pharmacy *"
                        >
                            {pharmacies.map((pharm) => (
                                <MenuItem key={pharm.id} value={pharm.id}>
                                    {pharm.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />

                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                openDialog={deleteDialogOpen}
                title="Delete Inventory"
                message="Are you sure you want to delete this inventory item?"
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                handleDialogClose={() => setDeleteDialogOpen(false)}
                handleDialogAction={confirmDelete}
            />
        </>
    );
};

export default InventoryTab;