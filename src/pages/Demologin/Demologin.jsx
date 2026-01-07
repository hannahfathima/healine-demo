// components/DemoLogin.js
import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { 
  createRecord, 
  fetchList, 
  updateRecord, 
  deleteRecord,
  getRecord 
} from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { 
  demoLoginListSuccess, 
  demoLoginListFailed,
  demoLoginDetailSuccess,
  demoLoginDetailFailed 
} from "../../store/reducers/demoSlice";
import { rowsPerPageJsonData } from "../../utils/jsonData";

const DemoLogin = (props) => {
  const { 
    demoLoginList, 
    demoLoginListSuccess, 
    demoLoginListFailed,
    demoLoginDetailSuccess,
    demoLoginDetailFailed 
  } = props;
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [demoLoginData, setDemoLoginData] = useState({ 
    android_version: "",
    ios_version: "",
    androidButtonVisible: false,
    iosButtonVisible: false
  });
  const [demoLoginId, setDemoLoginId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteDemoLoginId, setDeleteDemoLoginId] = useState(0);
  const [demoLoginDataGridOptions, setDemoLoginDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });

  const demoLoginDataGridColumns = [
    { 
      field: "android_version", 
      headerName: "Android Version", 
      flex: 1,
      renderCell: (params) => params.value || "N/A"
    },
    { 
      field: "ios_version", 
      headerName: "iOS Version", 
      flex: 1,
      renderCell: (params) => params.value || "N/A"
    },
    {
      field: "androidButtonVisible",
      headerName: "Android Button",
      flex: 1,
      type: "boolean",
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: "iosButtonVisible",
      headerName: "iOS Button",
      flex: 1,
      type: "boolean",
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => editDemoLogin(params.row.id)}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => deleteDemoLogin(params.row.id)}
            arialLabel="delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  const updateDemoLoginDataGridOptions = (key, value) =>
    setDemoLoginDataGridOptions((prev) => ({ ...prev, [key]: value }));

  const getDemoLoginList = useCallback(async () => {
    updateDemoLoginDataGridOptions("loading", true);
    try {
      const result = await fetchList(
        `${ApiEndPoints.DEMO_LOGIN}?page_no=${demoLoginDataGridOptions.page}&items_per_page=${demoLoginDataGridOptions.pageSize}`
      );
      if (result.status === 200) {
        // Handle different API response structures
        const data = result.data;
        const rows = data.rows || data.data || data;
        const totalRows = data.count || data.total || rows.length;
        
        updateDemoLoginDataGridOptions("totalRows", totalRows);
        demoLoginListSuccess(rows);
        updateDemoLoginDataGridOptions("loading", false);
      } else {
        updateDemoLoginDataGridOptions("totalRows", 0);
        demoLoginListFailed();
        updateDemoLoginDataGridOptions("loading", false);
        toast.error(result.message || "Failed to fetch Demo Login data");
      }
    } catch (error) {
      updateDemoLoginDataGridOptions("totalRows", 0);
      demoLoginListFailed();
      updateDemoLoginDataGridOptions("loading", false);
      toast.error("Failed to fetch Demo Login data");
    }
  }, [
    demoLoginDataGridOptions.page, 
    demoLoginDataGridOptions.pageSize, 
    demoLoginListSuccess, 
    demoLoginListFailed
  ]);

  useEffect(() => {
    getDemoLoginList();
  }, [getDemoLoginList]);

  useEffect(() => {
    // Transform the API data to ensure each row has a unique id
    const demoLoginRows = (demoLoginList || []).map((item, index) => {
      // Check if the item has a proper ID from the database
      const hasValidId = item.id && typeof item.id === 'number' && item.id > 0;
      const rowId = hasValidId ? item.id : `temp-${index}-${Date.now()}`;
      
      return {
        id: rowId,
        android_version: item.android_version,
        ios_version: item.ios_version,
        androidButtonVisible: item.androidButtonVisible || false,
        iosButtonVisible: item.iosButtonVisible || false,
        _isTemp: !hasValidId, // Flag to identify temporary items
        actions: "Actions",
      };
    });
    updateDemoLoginDataGridOptions("rows", demoLoginRows);
  }, [demoLoginList]);

  const handleOpen = () => {
    setDemoLoginData({ 
      android_version: "",
      ios_version: "",
      androidButtonVisible: false,
      iosButtonVisible: false
    });
    setDemoLoginId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDemoLoginData({ 
      android_version: "",
      ios_version: "",
      androidButtonVisible: false,
      iosButtonVisible: false
    });
    setDemoLoginId(null);
  };

  const editDemoLogin = async (id) => {
    try {
      // Check if it's a temporary ID
      if (id && id.toString().startsWith('temp-')) {
        toast.error("This item is not yet saved to the server. Please refresh the page and try again.");
        return;
      }

      const result = await getRecord(id, ApiEndPoints.DEMO_LOGIN);
      if (result.status === 200) {
        setDemoLoginData({
          android_version: result.data.android_version || "",
          ios_version: result.data.ios_version || "",
          androidButtonVisible: result.data.androidButtonVisible || false,
          iosButtonVisible: result.data.iosButtonVisible || false,
        });
        setDemoLoginId(id);
        setOpen(true);
        demoLoginDetailSuccess(result.data);
      } else {
        toast.error(result.message || "Failed to fetch demo login details");
        demoLoginDetailFailed();
      }
    } catch (error) {
      toast.error("Error fetching demo login details");
      demoLoginDetailFailed();
    }
  };

  const deleteDemoLogin = (id) => {
    // Check if it's a temporary ID
    if (id && id.toString().startsWith('temp-')) {
      toast.error("This item is not yet saved to the server. Please refresh the page and try again.");
      return;
    }
    
    // Find the item to confirm it exists
    const itemToDelete = demoLoginDataGridOptions.rows.find(row => row.id === id);
    if (!itemToDelete) {
      toast.error("Item not found");
      return;
    }
    
    setDeleteDemoLoginId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDemoLoginId) {
      toast.error("No item selected for deletion");
      return;
    }

    setOpenDeleteDialog(false);
    try {
      const result = await deleteRecord(deleteDemoLoginId, ApiEndPoints.DEMO_LOGIN);
      if (result.status === 200) {
        toast.success(result.message || "Demo Login deleted successfully");
        getDemoLoginList(); // Refresh the list
      } else {
        toast.error(result.message || "Failed to delete Demo Login");
      }
    } catch (error) {
      toast.error("Error deleting demo login");
    } finally {
      setDeleteDemoLoginId(0);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteDemoLoginId(0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDemoLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = async () => {
    const data = {
      android_version: demoLoginData.android_version,
      ios_version: demoLoginData.ios_version,
      androidButtonVisible: demoLoginData.androidButtonVisible,
      iosButtonVisible: demoLoginData.iosButtonVisible,
    };

    // Validate required fields
    if (!demoLoginData.android_version && !demoLoginData.ios_version) {
      toast.error("Please provide at least one version (Android or iOS)");
      return;
    }

    try {
      if (!demoLoginId) {
        // Create new record
        const result = await createRecord(data, ApiEndPoints.DEMO_LOGIN);
        if (result.status === 200) {
          toast.success(result.message || "Demo Login created successfully");
          getDemoLoginList(); // Refresh the list to get the actual ID from server
          handleClose();
        } else {
          toast.error(result.message || "Failed to create Demo Login");
        }
      } else {
        // Update existing record - make sure it's a valid ID
        if (demoLoginId.toString().startsWith('temp-')) {
          toast.error("Cannot update an unsaved item. Please refresh the page.");
          return;
        }

        const result = await updateRecord(data, demoLoginId, ApiEndPoints.DEMO_LOGIN);
        if (result.status === 200) {
          toast.success(result.message || "Demo Login updated successfully");
          getDemoLoginList(); // Refresh the list
          handleClose();
        } else {
          toast.error(result.message || "Failed to update Demo Login");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving demo login data");
    }
  };

  // Custom getRowId function to handle various ID scenarios
  const getRowId = (row) => row.id;

  return (
    <div className="min-width">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Demo Login Settings</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{
            background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
            textTransform: "capitalize",
          }}
        >
          Add Demo Login
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={demoLoginDataGridOptions.loading}
          rowCount={demoLoginDataGridOptions.totalRows}
          rowsPerPageOptions={demoLoginDataGridOptions.rowsPerPageOptions}
          rows={demoLoginDataGridOptions.rows}
          columns={demoLoginDataGridColumns}
          page={demoLoginDataGridOptions.page - 1}
          pageSize={demoLoginDataGridOptions.pageSize}
          getRowId={getRowId}
          onPageChange={(newPage) => {
            updateDemoLoginDataGridOptions("page", newPage + 1);
          }}
          onPageSizeChange={(pageSize) => {
            updateDemoLoginDataGridOptions("page", 1);
            updateDemoLoginDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>

      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm Delete Demo Login"
        message="Do you really want to delete this demo login configuration?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={handleCloseDeleteDialog}
        handleDialogAction={handleConfirmDelete}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {demoLoginId ? "Edit Demo Login" : "Add Demo Login"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="android_version"
                label="Android Version"
                type="text"
                fullWidth
                value={demoLoginData.android_version}
                variant="outlined"
                onChange={handleInputChange}
                placeholder="e.g., 4.4.20+2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="ios_version"
                label="iOS Version"
                type="text"
                fullWidth
                value={demoLoginData.ios_version}
                variant="outlined"
                onChange={handleInputChange}
                placeholder="e.g., 1.2.6+10"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="androidButtonVisible"
                    checked={demoLoginData.androidButtonVisible}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Android Button Visible"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="iosButtonVisible"
                    checked={demoLoginData.iosButtonVisible}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="iOS Button Visible"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            size="large"
            variant="contained"
            disableElevation
            onClick={onSubmit}
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
            }}
          >
            {demoLoginId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  demoLoginList: state.demoLogin.demoLoginList,
});

const mapDispatchToProps = (dispatch) => ({
  demoLoginListSuccess: (data) => dispatch(demoLoginListSuccess(data)),
  demoLoginListFailed: () => dispatch(demoLoginListFailed()),
  demoLoginDetailSuccess: (data) => dispatch(demoLoginDetailSuccess(data)),
  demoLoginDetailFailed: () => dispatch(demoLoginDetailFailed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DemoLogin);