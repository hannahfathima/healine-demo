import * as React from "react";
import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import {
    Grid,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CustomIconButton from "../../shared/components/CustomIconButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import imageCompression from 'browser-image-compression';
import { rowsPerPageJsonData } from "../../utils/jsonData";

const PackageCategories = (props) => {
    const { onDeleteSuccess, onSaveSuccess } = props; // Props for callbacks if needed (e.g., refresh parent)

    const [categoriesDataGridOptions, setCategoriesDataGridOptions] = useState({
        loading: false,
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: rowsPerPageJsonData,
        pageSize: 10,
        page: 1,
    });
    const [categorySearchQuery, setCategorySearchQuery] = useState("");
    const [categorySearchTimeout, setCategorySearchTimeout] = useState(null);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: "",
        description: "",
        icon: null, // will hold File object or URL
    });
    const [categoryId, setCategoryId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const categoriesColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1.5 },
        { field: "description", headerName: "Description", flex: 2 },
        {
            field: "icon",
            headerName: "Icon",
            flex: 1,
            renderCell: (params) =>
                params.value ? (
                    <img
                        src={params.value}
                        alt="Category Icon"
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                            borderRadius: 4,
                        }}
                    />
                ) : (
                    "-"
                ),
        },


        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Tooltip title="Edit Category">
                        <CustomIconButton
                            onClickAction={() => handleEditCategory(params.id)}
                            ariaLabel="Edit Category"
                            icon={<EditIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Category">
                        <CustomIconButton
                            onClickAction={() => handleDeleteCategory(params.id)}
                            ariaLabel="Delete"
                            icon={<DeleteIcon />}
                        />
                    </Tooltip>
                </>
            ),
        },
    ];

    const getCategoriesList = useCallback(async () => {
        setCategoriesDataGridOptions((prev) => ({ ...prev, loading: true }));
        try {
            const result = await fetchList(
                ApiEndPoints.PACKAGE_CATEGORIES +
                `?page_no=${categoriesDataGridOptions.page}&items_per_page=${categoriesDataGridOptions.pageSize}&search_text=${categorySearchQuery}`
            );
            if (result.status === 200) {
                const categoryRows = result.data.rows?.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || "",
                    icon: item.icon || "",

                }));
                setCategoriesDataGridOptions((prev) => ({
                    ...prev,
                    rows: categoryRows,
                    totalRows: result.data.count,
                    loading: false,
                }));
            }
        } catch (error) {
            setCategoriesDataGridOptions((prev) => ({ ...prev, loading: false }));
            toast.error("Failed to fetch categories: " + (error.response?.data?.message || error.message));
        }
    }, [categoriesDataGridOptions.page, categoriesDataGridOptions.pageSize, categorySearchQuery]);

    const handleCategorySearchChange = (value) => {
        if (categorySearchTimeout) clearTimeout(categorySearchTimeout);
        const timeout = setTimeout(() => {
            setCategorySearchQuery(value);
            setCategoriesDataGridOptions(prev => ({ ...prev, page: 1 }));
        }, 500);
        setCategorySearchTimeout(timeout);
    };

    const handleOpenCategoryDialog = () => {
        setCategoryFormData({ name: "" });
        setCategoryId(null);
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
        setCategoryId(null);
    };
    const handleEditCategory = async (id) => {
        try {
            const result = await fetchList(`${ApiEndPoints.PACKAGE_CATEGORIES}/${id}`);
            if (result.status === 200) {
                setCategoryFormData({
                    name: result.data.name || "",
                    description: result.data.description || "",
                    icon: result.data.icon || null,
                });
                setCategoryId(id);
                setOpenCategoryDialog(true);
            }
        } catch (error) {
            toast.error(
                "Failed to fetch category details: " +
                (error.response?.data?.message || error.message)
            );
        }
    };


    const handleDeleteCategory = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleSaveCategory = async () => {
        if (!categoryFormData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", categoryFormData.name);
            formData.append("description", categoryFormData.description || "");
            if (categoryFormData.icon instanceof File) {
                formData.append("icon", categoryFormData.icon);
            }

            let result;
            if (categoryId) {
                result = await updateRecord(formData, categoryId, ApiEndPoints.PACKAGE_CATEGORIES, true);
            } else {
                result = await createRecord(formData, ApiEndPoints.PACKAGE_CATEGORIES, true);
            }

            if (result.status === 200) {
                toast.success(result.data.message || "Category saved successfully");
                handleCloseCategoryDialog();
                getCategoriesList();
                if (onSaveSuccess) onSaveSuccess();
            } else {
                toast.error(result.data.message || "Failed to save category");
            }
        } catch (error) {
            toast.error("Failed to save category: " + (error.response?.data?.message || error.message));
        }
    };


    const handleConfirmDelete = async () => {
        try {
            const result = await deleteRecord(deleteId, ApiEndPoints.PACKAGE_CATEGORIES);
            if (result.status === 200) {
                toast.success(result.message || "Deleted successfully");
                getCategoriesList();
                if (onDeleteSuccess) onDeleteSuccess(); // Callback to parent if needed
            } else {
                toast.error(result.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
        }
        setOpenDeleteDialog(false);
    };

    useEffect(() => {
        getCategoriesList();
    }, [getCategoriesList]);

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <TextField
                    placeholder="Search Categories"
                    variant="outlined"
                    size="small"
                    value={categorySearchQuery}
                    onChange={(e) => handleCategorySearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={handleOpenCategoryDialog}
                >
                    Create New Category
                </Button>
            </div>
            <div style={{ height: "65vh", width: "100%" }}>
                <DataGrid
                    density="compact"
                    autoHeight
                    getRowHeight={() => "auto"}
                    pagination
                    paginationMode="server"
                    loading={categoriesDataGridOptions.loading}
                    rowCount={categoriesDataGridOptions.totalRows}
                    rowsPerPageOptions={categoriesDataGridOptions.rowsPerPageOptions}
                    rows={categoriesDataGridOptions.rows}
                    columns={categoriesColumns}
                    page={categoriesDataGridOptions.page - 1}
                    pageSize={categoriesDataGridOptions.pageSize}
                    onPageChange={(newPage) => {
                        setCategoriesDataGridOptions((old) => ({
                            ...old,
                            page: newPage + 1,
                        }));
                    }}
                    onPageSizeChange={(pageSize) => {
                        setCategoriesDataGridOptions((old) => ({
                            ...old,
                            page: 1,
                            pageSize,
                        }));
                    }}
                />
            </div>

            {/* Add/Edit Category Dialog */}
            <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{categoryId ? "Edit Category" : "Add a Category"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name *"
                                value={categoryFormData.name}
                                onChange={(e) =>
                                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Description"
                                value={categoryFormData.description}
                                onChange={(e) =>
                                    setCategoryFormData({ ...categoryFormData, description: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="outlined" component="label">
                                Upload Icon
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                console.log('Original file size:', file.size / 1024 / 1024, 'MB');
                                                const options = {
                                                    maxSizeMB: 1,           // Max size after compression
                                                    maxWidthOrHeight: 1920, // Max dimension
                                                    useWebWorker: true,     // Improves performance
                                                    initialQuality: 0.85    // Start with 85% quality (adjustable)
                                                };
                                                const compressedFile = await imageCompression(file, options);
                                                console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
                                                // Convert back to File object (name, type preserved)
                                                const finalFile = new File([compressedFile], file.name, {
                                                    type: file.type,
                                                    lastModified: Date.now(),
                                                });
                                                setCategoryFormData({ ...categoryFormData, icon: finalFile });
                                            } catch (error) {
                                                console.error("Image compression error:", error);
                                                // Fallback: use original file
                                                setCategoryFormData({ ...categoryFormData, icon: file });
                                            }
                                        } else {
                                            // Keep existing icon if no new file selected
                                            setCategoryFormData({ ...categoryFormData, icon: categoryFormData.icon });
                                        }
                                    }}
                                />
                            </Button>

                            {categoryFormData.icon && (
                                <div style={{ marginTop: 10 }}>
                                    <img
                                        src={
                                            typeof categoryFormData.icon === "string"
                                                ? categoryFormData.icon
                                                : URL.createObjectURL(categoryFormData.icon)
                                        }
                                        alt="Category Icon"
                                        style={{ width: 80, height: 80, borderRadius: 4 }}
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseCategoryDialog} style={{ color: "#666" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveCategory}
                        variant="outlined"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                scroll="paper"
                maxWidth="md"
                title="Confirm The Action"
                message="Do you really want to delete this category?"
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                openDialog={openDeleteDialog}
                handleDialogClose={() => setOpenDeleteDialog(false)}
                handleDialogAction={handleConfirmDelete}
            />
        </>
    );
};

PackageCategories.propTypes = {
    onDeleteSuccess: PropTypes.func,
    onSaveSuccess: PropTypes.func,
};

PackageCategories.defaultProps = {
    onDeleteSuccess: () => { },
    onSaveSuccess: () => { },
};

export default PackageCategories;