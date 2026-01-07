// src/pages/admin/components/BrandsTab.jsx
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
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
} from "../../../apis/services/pharmacyApi";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";
import { SearchIcon } from "lucide-react";

const BrandsTab = () => {
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
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const columns = [
        {
            field: "logo",
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
        { field: "name", headerName: "Brand Name", flex: 1 },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            getActions: (params) => [
                // <CustomIconButton
                //     key="view"
                //     onClickAction={() => navigate(`/brand/${params.id}`)}
                //     arialLabel="view"
                //     icon={<VisibilityIcon />}
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

    const loadBrands = useCallback(
        async (pageNumber = page, limit = pageSize) => {
            setLoading(true);
            try {
                const res = await fetchBrands(pageNumber, limit, searchText);
                if (res.data.success) {
                    const mappedRows = res.data.data.rows.map((item) => ({
                        id: item.id,
                        name: item.name,
                        logo: item.logo,
                    }));
                    setRows(mappedRows);
                    setTotalRows(res.data.data.count);
                }
            } catch (err) {
                toast.error("Failed to load brands");
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
        loadBrands(page, pageSize);
    }, [loadBrands]);

    const handleEdit = (id) => {
        const brand = rows.find((r) => r.id === id);
        if (brand) {
            setId(id);
            setFormData({
                name: brand.name,
            });
            setPreviewLogo(brand.logo ? `${brand.logo}` : null);
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
            await deleteBrand(deletingId);
            toast.success("Brand deleted successfully");
            loadBrands();
        } catch (err) {
            toast.error("Failed to delete brand");
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setId(null);
        setFormData({ name: "" });
        setLogoFile(null);
        setPreviewLogo(null);
    };

    const handleSubmit = async () => {
        const trimmedName = formData.name.trim();
        if (!trimmedName) {
            toast.error("Brand name is required.");
            return;
        }

        const payload = new FormData();
        payload.append("name", trimmedName);
        if (logoFile) {
            payload.append("logo", logoFile);
        }

        try {
            let response;
            if (id) {
                const isMultipart = !!logoFile;
                response = await updateBrand(id, payload, isMultipart);
                toast.success("Brand updated successfully");
            } else {
                response = await createBrand(payload);
                toast.success("Brand created successfully");
            }
            handleClose();
            loadBrands();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save brand");
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
                    Add Brand
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
                    {id ? "Edit Brand" : "Add Brand"}
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
                        label="Brand Name"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div style={{ marginTop: 16 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Brand Logo
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
                title="Delete Brand"
                message="Are you sure you want to delete this pharmacy brand?"
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                handleDialogClose={() => setDeleteDialogOpen(false)}
                handleDialogAction={confirmDelete}
            />
        </>
    );
};

export default BrandsTab;