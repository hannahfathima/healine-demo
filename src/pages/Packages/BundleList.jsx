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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  OutlinedInput,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CustomIconButton from "../../shared/components/CustomIconButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import imageCompression from 'browser-image-compression';
import { rowsPerPageJsonData } from "../../utils/jsonData";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "axios";
import { useNavigate } from "react-router-dom";

// Add to ApiEndPoints if not exists
// ApiEndPoints.PACKAGE_BUNDLES = '/api/v1/admin/package-bundles';

const BundleList = (props) => {
  const { onDeleteSuccess, onSaveSuccess } = props;
  const navigate = useNavigate();
  const [bundlesDataGridOptions, setBundlesDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [bundleSearchQuery, setBundleSearchQuery] = useState("");
  const [bundleSearchTimeout, setBundleSearchTimeout] = useState(null);
  const [openBundleDialog, setOpenBundleDialog] = useState(false);
  const [bundleFormData, setBundleFormData] = useState({
    name: "",
    sub_title: "",
    description: "",
    base_price: "",
    strike_price: "",
    selling_price: "",
    validity_days: "",
    label: "",
    individual_restriction: false,
    visible: true,
    establishment_id: "",
    category_id: "",
    image: null,
  });
  const [bundleId, setBundleId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openAddPackagesDialog, setOpenAddPackagesDialog] = useState(false);
  const [updateBundleId, setUpdateBundleId] = useState(null);
  const [currentBundleDetails, setCurrentBundleDetails] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [packagesForSelect, setPackagesForSelect] = useState([]);
  const [packageSearchQuery, setPackageSearchQuery] = useState("");
  const [establishments, setEstablishments] = useState([]);
  const [categories, setCategories] = useState([]);

  const bundlesColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "sub_title", headerName: "Sub Title", flex: 1 },
    { field: "selling_price", headerName: "Selling Price (AED)", flex: 0.8 },
    { field: "category_name", headerName: "Category", flex: 1 },
    { field: "establishment_name", headerName: "Establishment", flex: 1 },
    { field: "visible", headerName: "Visible", flex: 0.5, renderCell: (params) => (params.value ? "Yes" : "No") },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          {/* 👁 VIEW DETAILS (NEW) */}
          <Tooltip title="View Bundle">
            <CustomIconButton
              onClickAction={() => navigate(`/package-bundles/${params.id}`)}
              ariaLabel="View Bundle"
              icon={<VisibilityIcon />}
            />
          </Tooltip>

          <Tooltip title="Edit Bundle">
            <CustomIconButton
              onClickAction={() => handleEditBundle(params.id)}
              ariaLabel="Edit Bundle"
              icon={<EditIcon />}
            />
          </Tooltip>
          <Tooltip title="Manage Packages">
            <CustomIconButton
              onClickAction={() => handleManagePackages(params.id)}
              ariaLabel="Manage Packages"
              icon={<AddCircleOutlineIcon />}
            />
          </Tooltip>
          <Tooltip title="Delete Bundle">
            <CustomIconButton
              onClickAction={() => handleDeleteBundle(params.id)}
              ariaLabel="Delete"
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const getBundlesList = useCallback(async () => {
    setBundlesDataGridOptions((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchList(
        ApiEndPoints.PACKAGE_BUNDLES +
        `?page_no=${bundlesDataGridOptions.page}&items_per_page=${bundlesDataGridOptions.pageSize}&search_text=${bundleSearchQuery}`
      );
      if (result.status === 200) {
        const bundleRows = result.data.rows?.map((item) => ({
          id: item.id,
          name: item.name,
          sub_title: item.sub_title || "",
          selling_price: item.selling_price,
          category_name: item.category?.name || "N/A",
          establishment_name: item.establishment?.name || "N/A",
          visible: item.visible,
        }));
        setBundlesDataGridOptions((prev) => ({
          ...prev,
          rows: bundleRows,
          totalRows: result.data.count,
          loading: false,
        }));
      }
    } catch (error) {
      setBundlesDataGridOptions((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to fetch bundles: " + (error.response?.data?.message || error.message));
    }
  }, [bundlesDataGridOptions.page, bundlesDataGridOptions.pageSize, bundleSearchQuery]);

  const handleBundleSearchChange = (value) => {
    if (bundleSearchTimeout) clearTimeout(bundleSearchTimeout);
    const timeout = setTimeout(() => {
      setBundleSearchQuery(value);
      setBundlesDataGridOptions(prev => ({ ...prev, page: 1 }));
    }, 500);
    setBundleSearchTimeout(timeout);
  };

  const handleOpenBundleDialog = () => {
    setBundleFormData({
      name: "",
      sub_title: "",
      description: "",
      base_price: "",
      strike_price: "",
      selling_price: "",
      validity_days: "",
      label: "",
      individual_restriction: false,
      visible: true,
      establishment_id: "",
      category_id: "",
      image: null,
    });
    setBundleId(null);
    setOpenBundleDialog(true);
  };

  const handleCloseBundleDialog = () => {
    setOpenBundleDialog(false);
    setBundleId(null);
  };

  const handleEditBundle = async (id) => {
    try {
      const result = await fetchList(`${ApiEndPoints.PACKAGE_BUNDLES}/${id}`);
      if (result.status === 200) {
        const bundleData = result.data;
        setBundleFormData({
          name: bundleData.name || "",
          sub_title: bundleData.sub_title || "",
          description: bundleData.description || "",
          base_price: bundleData.base_price || "",
          strike_price: bundleData.strike_price || "",
          selling_price: bundleData.selling_price || "",
          validity_days: bundleData.validity_days || "",
          label: bundleData.label || "",
          individual_restriction: bundleData.individual_restriction || false,
          visible: bundleData.visible !== undefined ? bundleData.visible : true,
          establishment_id: bundleData.establishment?.id || bundleData.establishment_id || "",
          category_id: bundleData.category?.id || bundleData.category_id || "",
          image: bundleData.image || null,
        });
        setBundleId(id);
        setOpenBundleDialog(true);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch bundle details: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteBundle = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleSaveBundle = async () => {
    if (!bundleFormData.name.trim()) {
      toast.error("Bundle name is required");
      return;
    }
    if (!bundleFormData.selling_price || parseFloat(bundleFormData.selling_price) <= 0) {
      toast.error("Selling price is required and must be positive");
      return;
    }
    if (!bundleFormData.base_price || parseFloat(bundleFormData.base_price) < 0) {
      toast.error("Base price is required and must be non-negative");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", bundleFormData.name);
      formData.append("sub_title", bundleFormData.sub_title || "");
      formData.append("description", bundleFormData.description || "");
      formData.append("base_price", parseFloat(bundleFormData.base_price) || 0);
      formData.append("strike_price", parseFloat(bundleFormData.strike_price) || 0);
      formData.append("selling_price", parseFloat(bundleFormData.selling_price) || 0);
      formData.append("validity_days", parseInt(bundleFormData.validity_days) || 0);
      formData.append("label", bundleFormData.label || "");
      formData.append("individual_restriction", bundleFormData.individual_restriction);
      formData.append("visible", bundleFormData.visible);
      if (bundleFormData.establishment_id) {
        formData.append("establishment_id", bundleFormData.establishment_id);
      }
      if (bundleFormData.category_id) {
        formData.append("category_id", bundleFormData.category_id);
      }
      if (bundleFormData.image instanceof File) {
        formData.append("image", bundleFormData.image);
      }
      let result;
      if (bundleId) {
        result = await updateRecord(formData, bundleId, ApiEndPoints.PACKAGE_BUNDLES, true);
      } else {
        result = await createRecord(formData, ApiEndPoints.PACKAGE_BUNDLES, true);
      }
      if (result.status === 200) {
        toast.success(result.data.message || "Bundle saved successfully");
        handleCloseBundleDialog();
        getBundlesList();
        if (onSaveSuccess) onSaveSuccess();
      } else {
        toast.error(result.data.message || "Failed to save bundle");
      }
    } catch (error) {
      toast.error("Failed to save bundle: " + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteRecord(deleteId, ApiEndPoints.PACKAGE_BUNDLES);
      if (result.status === 200) {
        toast.success(result.message || "Deleted successfully");
        getBundlesList();
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
    }
    setOpenDeleteDialog(false);
  };

  // Fetch helpers
  const fetchEstablishments = useCallback(async () => {
    try {
      const result = await fetchList(ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT);
      if (result.status === 200) {
        setEstablishments(result.data.map(item => ({
          id: item.id,
          name: item.name
        })));
      }
    } catch (error) {
      console.error("Failed to fetch establishments:", error);
      toast.error("Failed to load establishments");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await fetchList(ApiEndPoints.GET_PACKAGES_CATERGORIES);
      if (result.status === 200) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const fetchPackagesForSelect = useCallback(async () => {
    try {
      const result = await fetchList(ApiEndPoints.GET_PACKAGES_FOR_SELECT);
      if (result.status === 200) {
        setPackagesForSelect(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch packages for select:", error);
      toast.error("Failed to load packages");
    }
  }, []);

  const handleManagePackages = async (id) => {
    setUpdateBundleId(id);
    setSelectedPackages([]);
    setPackageSearchQuery("");
    setCurrentBundleDetails(null);
    try {
      const bundleResult = await fetchList(`${ApiEndPoints.PACKAGE_BUNDLES}/${id}`);
      if (bundleResult.status === 200) {
        setCurrentBundleDetails({
          id,
          name: bundleResult.data.name,
        });
        // Load already added packages as selected
        const currentPackages = bundleResult.data.packages || [];
        setSelectedPackages(currentPackages.map(p => ({
          id: p.id,
          qty: p.PackageBundleItem?.qty || 1
        })));
      }
      await fetchPackagesForSelect(); // Load available packages
    } catch (error) {
      toast.error("Failed to fetch bundle packages: " + (error.response?.data?.message || error.message));
    }
    setOpenAddPackagesDialog(true);
  };

  const handlePackageChange = (pkgId, checked, qty = 1) => {
    if (checked) {
      setSelectedPackages(prev => [...prev.filter(p => p.id !== pkgId), { id: pkgId, qty }]);
    } else {
      setSelectedPackages(prev => prev.filter(p => p.id !== pkgId));
    }
  };

  const handleQtyChange = (pkgId, qty) => {
    setSelectedPackages(prev => prev.map(p => p.id === pkgId ? { ...p, qty: parseInt(qty) || 1 } : p));
  };

  const handleAddPackages = async () => {
    if (selectedPackages.length === 0) {
      toast.error("Select at least one package");
      return;
    }
    try {
      // Map to package_ids, ignore qty for now since endpoint doesn't support, or assume multiple adds
      const packageIds = selectedPackages.map(p => p.id);
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}${ApiEndPoints.PACKAGE_BUNDLES}/${updateBundleId}/add-packages`,
        { package_ids: packageIds }
      );
      if (result.status === 200) {
        toast.success("Packages added successfully");
        setOpenAddPackagesDialog(false);
        // Optionally refresh list
      } else {
        toast.error(result.data.message || "Failed to add packages");
      }
    } catch (error) {
      toast.error("Failed to add packages: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    getBundlesList();
    fetchEstablishments();
    fetchCategories();
  }, [getBundlesList, fetchEstablishments, fetchCategories]);

  const filteredPackages = packagesForSelect.filter(pkg =>
    pkg.name.toLowerCase().includes(packageSearchQuery.toLowerCase())
  );

  return (
    <div className="min-width">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <TextField
          placeholder="Search Bundles"
          variant="outlined"
          size="small"
          value={bundleSearchQuery}
          onChange={(e) => handleBundleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <Button
          variant="outlined"
          onClick={handleOpenBundleDialog}
        >
          Create New Bundle
        </Button>
      </div>
      <div style={{ height: "65vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={bundlesDataGridOptions.loading}
          rowCount={bundlesDataGridOptions.totalRows}
          rowsPerPageOptions={bundlesDataGridOptions.rowsPerPageOptions}
          rows={bundlesDataGridOptions.rows}
          columns={bundlesColumns}
          page={bundlesDataGridOptions.page - 1}
          pageSize={bundlesDataGridOptions.pageSize}
          onPageChange={(newPage) => {
            setBundlesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            setBundlesDataGridOptions((old) => ({
              ...old,
              page: 1,
              pageSize,
            }));
          }}
        />
      </div>

      {/* Add/Edit Bundle Dialog */}
      <Dialog open={openBundleDialog} onClose={handleCloseBundleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{bundleId ? "Edit Bundle" : "Add a Bundle"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                value={bundleFormData.name}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sub Title"
                value={bundleFormData.sub_title}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, sub_title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                value={bundleFormData.description}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={bundleFormData.category_id || ""}
                  label="Category"
                  onChange={(e) => setBundleFormData({ ...bundleFormData, category_id: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Establishment</InputLabel>
                <Select
                  value={bundleFormData.establishment_id || ""}
                  label="Establishment"
                  onChange={(e) => setBundleFormData({ ...bundleFormData, establishment_id: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {establishments.map((est) => (
                    <MenuItem key={est.id} value={est.id}>
                      {est.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Base Price (AED) *"
                type="number"
                value={bundleFormData.base_price}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, base_price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Selling Price (AED) *"
                type="number"
                value={bundleFormData.selling_price}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, selling_price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Strike Price (AED)"
                type="number"
                value={bundleFormData.strike_price}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, strike_price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Validity Days"
                type="number"
                value={bundleFormData.validity_days}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, validity_days: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                value={bundleFormData.label}
                onChange={(e) =>
                  setBundleFormData({ ...bundleFormData, label: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bundleFormData.individual_restriction}
                    onChange={(e) => setBundleFormData({ ...bundleFormData, individual_restriction: e.target.checked })}
                  />
                }
                label="Individual Restriction"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bundleFormData.visible}
                    onChange={(e) => setBundleFormData({ ...bundleFormData, visible: e.target.checked })}
                  />
                }
                label="Visible"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Image *
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const options = {
                          maxSizeMB: 1,
                          maxWidthOrHeight: 1920,
                          useWebWorker: true,
                          initialQuality: 0.85
                        };
                        const compressedFile = await imageCompression(file, options);
                        const finalFile = new File([compressedFile], file.name, {
                          type: file.type,
                          lastModified: Date.now(),
                        });
                        setBundleFormData({ ...bundleFormData, image: finalFile });
                      } catch (error) {
                        setBundleFormData({ ...bundleFormData, image: file });
                      }
                    }
                  }}
                />
              </Button>
              {bundleFormData.image && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={
                      typeof bundleFormData.image === "string"
                        ? bundleFormData.image
                        : URL.createObjectURL(bundleFormData.image)
                    }
                    alt="Bundle Image"
                    style={{ width: 80, height: 80, borderRadius: 4 }}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBundleDialog} style={{ color: "#666" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveBundle}
            variant="outlined"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Packages Dialog */}
      <Dialog open={openAddPackagesDialog} onClose={() => setOpenAddPackagesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Packages for Bundle {currentBundleDetails?.name || `ID: ${updateBundleId}`}</DialogTitle>
        <DialogContent>
          {currentBundleDetails && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="body2" color="text.secondary">ID</Typography>
                  <Typography variant="body1">{currentBundleDetails.id}</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{currentBundleDetails.name}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          <Typography variant="subtitle2" gutterBottom>
            Select packages to add ({selectedPackages.length} selected)
          </Typography>
          <TextField
            fullWidth
            placeholder="Search packages"
            size="small"
            sx={{ mb: 2 }}
            value={packageSearchQuery}
            onChange={(e) => setPackageSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPackages.some(p => p.id === pkg.id);
              return (
                <Box key={pkg.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handlePackageChange(pkg.id, e.target.checked)}
                      />
                    }
                    label={pkg.name}
                  />
                  {isSelected && (
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      size="small"
                      sx={{ mt: 1, ml: 4 }}
                      defaultValue={1}
                      onChange={(e) => handleQtyChange(pkg.id, e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPackagesDialog(false)} style={{ color: "#666" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPackages}
            variant="outlined"
          >
            Add Selected
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete this bundle?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={() => setOpenDeleteDialog(false)}
        handleDialogAction={handleConfirmDelete}
      />
    </div>
  );
};

BundleList.propTypes = {
  onDeleteSuccess: PropTypes.func,
  onSaveSuccess: PropTypes.func,
};

BundleList.defaultProps = {
  onDeleteSuccess: () => { },
  onSaveSuccess: () => { },
};

export default BundleList;