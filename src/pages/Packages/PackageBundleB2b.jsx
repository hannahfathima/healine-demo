import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchList, createRecord, updateRecord, deleteRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import CustomIconButton from "../../shared/components/CustomIconButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
// Import the phone input library
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};
const PackageBundleB2b = (props) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    bundle_id: "",
    coupon_code: "",
    total_price: "",
    employees: [],
  });
  const [bundles, setBundles] = useState([]);
  const [gridOptions, setGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "company_name", headerName: "Company Name", flex: 1.5 },
    { field: "bundle_name", headerName: "Bundle", flex: 1 },
    { field: "total_price", headerName: "Total Price (AED)", flex: 0.8 },
    { field: "employee_count", headerName: "Employees", flex: 0.8 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          <Tooltip title="View Subscription">
            <CustomIconButton
              onClickAction={() => navigate(`/b2b-subscriptions/view/${params.id}`)}
              ariaLabel="View"
              icon={<RemoveRedEyeIcon />}
            />
          </Tooltip>
          <Tooltip title="Edit Subscription">
            <CustomIconButton
              onClickAction={() => handleEditSubscription(params.id)}
              ariaLabel="Edit"
              icon={<EditIcon />}
            />
          </Tooltip>
          <Tooltip title="Delete Subscription">
            <CustomIconButton
              onClickAction={() => handleDeleteSubscription(params.id)}
              ariaLabel="Delete"
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </>
      ),
    },
  ];
  const fetchSubscriptions = useCallback(async () => {
    setGridOptions((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchList(
        `/b2b/b2b-subscriptions?page_no=1&items_per_page=10000&search_text=${searchQuery}`
      );
      if (result.status === 200) {
        const rows = result.data.data?.map((item) => ({
          id: item.id,
          company_name: item.company_name,
          bundle_name: item.bundle?.name || "N/A",
          total_price: item.total_price,
          employee_count: item.employee_count,
        })) || [];
        setGridOptions((prev) => ({
          ...prev,
          rows,
          totalRows: rows.length,
          loading: false,
        }));
      }
    } catch (error) {
      setGridOptions((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to fetch B2B subscriptions: " + (error.response?.data?.message || error.message));
    }
  }, [searchQuery]);
  const fetchBundlesForSelect = useCallback(async () => {
    try {
      const result = await fetchList(`${ApiEndPoints.PACKAGE_BUNDLES}?page_no=1&items_per_page=1000`);
      if (result.status === 200) {
        setBundles(result.data.rows || []);
      }
    } catch (error) {
      console.error("Failed to fetch bundles:", error);
      toast.error("Failed to load bundles");
    }
  }, []);
  useEffect(() => {
    fetchSubscriptions();
    fetchBundlesForSelect();
  }, [fetchSubscriptions, fetchBundlesForSelect]);
  const handleSearchChange = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setSearchQuery(value);
      setGridOptions((prev) => ({ ...prev, page: 1 }));
    }, 500);
    setSearchTimeout(timeout);
  };
  const handleOpenDialog = () => {
    setFormData({
      company_name: "",
      bundle_id: "",
      coupon_code: "",
      total_price: "",
      employees: [],
    });
    setSubscriptionId(null);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSubscriptionId(null);
  };
const handleEditSubscription = async (id) => {
  try {
    const result = await fetchList(`/b2b/b2b-subscriptions/${id}`);
    if (result.status === 200) {
      const data = result.data; // Note: your API wraps the actual object in "data"
      const employeeData = data.customers?.map((c) => ({
        // Combine country code + phone for PhoneInput display
        full_phone: c.country_code + c.employee_phone,
        phone: c.employee_phone || "",
        country_code: c.country_code || "+971",
        name: c.employee_name || "",
        designation: c.designation || "", // matches actual field name
      })) || [];
      setFormData({
        company_name: data.company_name || "",
        bundle_id: data.bundle_id || "",
        coupon_code: data.coupon_code || "",
        total_price: data.total_price || "",
        employees: employeeData,
      });
      setSubscriptionId(id);
      setOpenDialog(true);
    }
  } catch (error) {
    toast.error(
      "Failed to fetch subscription details: " + (error.response?.data?.message || error.message)
    );
  }
};
  const handleDeleteSubscription = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };
  const handleAddEmployee = () => {
    setFormData({
      ...formData,
      employees: [
        ...formData.employees,
        { full_phone: "+971", phone: "", country_code: "+971", name: "", designation: "" },
      ],
    });
  };
  const handleBulkUpload = () => {
    fileInputRef.current?.click();
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${baseUrl}/b2b/b2b-subscriptions/upload-employees`, {
        method: "POST",
        body: uploadFormData,
      });
      const result = await response.json();
      if (result.success && result.status === 200) {
        const parsedEmployees = result.data.employees.map((emp) => ({
          full_phone: emp.country_code + emp.phone,
          phone: emp.phone,
          country_code: emp.country_code,
          name: emp.name,
          designation: emp.designation,
        }));
        setFormData((prev) => ({ ...prev, employees: parsedEmployees }));
        toast.success("Employees uploaded and parsed successfully");
      } else {
        toast.error(result.message || "Failed to parse file");
      }
    } catch (error) {
      toast.error("Upload failed: " + (error.message || "Unknown error"));
    }
    e.target.value = ""; // Reset file input
  };
  const handleUpdateEmployeePhone = (index, fullValue) => {
    const newEmployees = [...formData.employees];
    let countryCode = "+971";
    let phoneNumber = "";
    if (fullValue) {
      const parsed = parsePhoneNumber(fullValue);
      if (parsed) {
        countryCode = "+" + parsed.countryCallingCode;
        phoneNumber = parsed.nationalNumber;
      } else {
        // Fallback if not fully parsable yet
        const match = fullValue.match(/^\+(\d+)/);
        countryCode = match ? "+" + match[1] : "+971";
        phoneNumber = fullValue.slice(countryCode.length).replace(/\D/g, "");
      }
    }
    newEmployees[index] = {
      ...newEmployees[index],
      full_phone: fullValue || "",
      country_code: countryCode,
      phone: phoneNumber,
    };
    setFormData({ ...formData, employees: newEmployees });
  };
  const handleUpdateEmployee = (index, field, value) => {
    const newEmployees = [...formData.employees];
    newEmployees[index] = { ...newEmployees[index], [field]: value };
    setFormData({ ...formData, employees: newEmployees });
  };
  const handleRemoveEmployee = (index) => {
    const newEmployees = formData.employees.filter((_, i) => i !== index);
    setFormData({ ...formData, employees: newEmployees });
  };
  const handleSaveSubscription = async () => {
    if (!formData.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!formData.bundle_id) {
      toast.error("Bundle is required");
      return;
    }
    if (!formData.total_price || isNaN(formData.total_price)) {
      toast.error("Total price is required and must be a number");
      return;
    }
    // Validate employees: phone should not be empty
    for (const emp of formData.employees) {
      if (!emp.phone.trim()) {
        toast.error("All employee phone numbers are required");
        return;
      }
    }
    const payload = {
      company_name: formData.company_name,
      bundle_id: parseInt(formData.bundle_id),
      coupon_code: formData.coupon_code,
      total_price: parseFloat(formData.total_price),
      employees: formData.employees.map((emp) => ({
        phone: emp.phone,
        country_code: emp.country_code,
        name: emp.name,
        designation: emp.designation,
      })),
    };
    try {
      let result;
      if (subscriptionId) {
        result = await updateRecord(payload, subscriptionId, "/b2b/b2b-subscriptions");
      } else {
        result = await createRecord(payload, "/b2b/b2b-subscriptions");
      }
      if (result.status === 200) {
        toast.success(result.data.message || "Subscription saved successfully");
        handleCloseDialog();
        fetchSubscriptions();
      } else {
        toast.error(result.data.message || "Failed to save subscription");
      }
    } catch (error) {
      toast.error("Failed to save subscription: " + (error.response?.data?.message || error.message));
    }
  };
  const handleConfirmDelete = async () => {
    try {
      const result = await deleteRecord(deleteId, "/b2b/b2b-subscriptions");
      if (result.status === 200) {
        toast.success(result.message || "Deleted successfully");
        fetchSubscriptions();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };
  return (
    <div className="min-width">
      {/* ... (same as before: header, search, DataGrid) ... */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <Typography variant="h4">B2B Subscriptions</Typography>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <TextField
          placeholder="Search Subscriptions"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon /> }}
        />
        <Button variant="outlined" onClick={handleOpenDialog}>
          Create New Subscription
        </Button>
      </div>
      <div style={{ height: "65vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          loading={gridOptions.loading}
          rowsPerPageOptions={gridOptions.rowsPerPageOptions}
          rows={gridOptions.rows}
          columns={columns}
          page={gridOptions.page - 1}
          pageSize={gridOptions.pageSize}
          onPageChange={(newPage) => setGridOptions((old) => ({ ...old, page: newPage + 1 }))}
          onPageSizeChange={(pageSize) => setGridOptions((old) => ({ ...old, page: 1, pageSize }))}
        />
      </div>
      {/* Create/Edit Dialog */}
      <BootstrapDialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <BootstrapDialogTitle onClose={handleCloseDialog}>
          {subscriptionId ? "Edit B2B Subscription" : "Add B2B Subscription"}
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ background: "#fafafa" }}>
          <Box sx={{ p: 2, mb: 2, background: "white", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name *"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Bundle *</InputLabel>
                  <Select
                    value={formData.bundle_id || ""}
                    label="Bundle"
                    onChange={(e) => setFormData({ ...formData, bundle_id: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {bundles.map((bundle) => (
                      <MenuItem key={bundle.id} value={bundle.id}>
                        {bundle.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  value={formData.coupon_code}
                  onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Price (AED) *"
                  type="number"
                  value={formData.total_price}
                  onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Employees Section */}
          <Box sx={{ p: 2, background: "white", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employees
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={300}><strong>Phone Number (with Country Code) *</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Designation</strong></TableCell>
                  <TableCell width={50}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.employees.map((employee, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AE"
                        value={employee.full_phone || ""}
                        onChange={(value) => handleUpdateEmployeePhone(idx, value)}
                        style={{ width: "100%" }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Employee name"
                        value={employee.name}
                        onChange={(e) => handleUpdateEmployee(idx, "name", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Designation"
                        value={employee.designation}
                        onChange={(e) => handleUpdateEmployee(idx, "designation", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleRemoveEmployee(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ display: "flex", gap: 8, mt: 2 }}>
              <Button startIcon={<UploadIcon />} onClick={handleBulkUpload} variant="outlined">
                Bulk Upload Employees
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                accept=".xlsx,.xls"
              />
              <Button startIcon={<AddIcon />} onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: "#666" }}>
            Cancel
          </Button>
          <Button onClick={handleSaveSubscription} variant="outlined">
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete this subscription?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={() => setOpenDeleteDialog(false)}
        handleDialogAction={handleConfirmDelete}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PackageBundleB2b);