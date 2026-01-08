import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import imageCompression from 'browser-image-compression';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom"; // Add this line
import Typography from "@mui/material/Typography";
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tabs,
  Tab,
  Box,
  Checkbox,
  ListItemText,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CustomIconButton from "../../shared/components/CustomIconButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import { RemoveRedEyeOutlined } from "@mui/icons-material";

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
      {onClose ? (
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
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`biomarker-tabpanel-${index}`}
      aria-labelledby={`biomarker-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Define the endpoint for updating biomarkers
const BIOMARKER_GROUPS_UPDATE_BIOMARKERS = `${process.env.REACT_APP_BASE_URL}/biomarker-groups/:id/update_biomarkers`;

const BiomarkerManagement = (props) => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate(); // Add this line
  // Biomarkers state
  const [openBiomarkerDialog, setOpenBiomarkerDialog] = useState(false);
  const [biomarkerFormData, setBiomarkerFormData] = useState({
    name: "",
    description: "",
    significance: "",
    type: "Quantitative",
    specimen: "Blood",
    unit: "",
    category: "Physiological",
    fasting_required: true,
    fasting_time_hours: "",
    critical_min: "",
    critical_max: "",
    normal_min: "",
    normal_max: "",
    base_price: "",
    selling_price: "",
    image: null,  // ADD THIS LINE
  });
  const [biomarkerId, setBiomarkerId] = useState(null);
  const [biomarkersDataGridOptions, setBiomarkersDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [groupSearchQuery, setGroupSearchQuery] = useState(""); // For Groups tab (ADD THIS)
  // Biomarker Groups state
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    selling_price: "",
    biomarkers: [],
    image: null, // ADD THIS
  });
  const [groupId, setGroupId] = useState(null);
  const [groupsDataGridOptions, setGroupsDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [addonSearchQuery, setAddonSearchQuery] = useState("");
  const [allBiomarkers, setAllBiomarkers] = useState([]);
  // Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "biomarker" or "group"

  // Biomarkers Columns
  const biomarkersColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "specimen", headerName: "Specimen", flex: 1 },
    { field: "unit", headerName: "Unit", flex: 0.8 },
    { field: "selling_price", headerName: "Price (AED)", flex: 0.8 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() =>
              navigate(`/biomarkers/${params.id}/view`)
            }
            ariaLabel="View"
            icon={<RemoveRedEyeOutlined />}
          />
          <CustomIconButton
            onClickAction={() => handleEditBiomarker(params.id)}
            ariaLabel="Edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => handleDeleteBiomarker(params.id)}
            ariaLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  // Groups Columns
  const groupsColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "selling_price", headerName: "Selling Price (AED)", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() =>
              navigate(`/biomarker-groups/${params.id}/view`)
            }
            ariaLabel="View"
            icon={<RemoveRedEyeOutlined />}
          />
          <CustomIconButton
            onClickAction={() => handleEditGroup(params.id)}
            ariaLabel="Edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => handleDeleteGroup(params.id)}
            ariaLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  // Fetch Biomarkers
  const getBiomarkersList = useCallback(async () => {
    setBiomarkersDataGridOptions((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchList(
        ApiEndPoints.BIOMARKERS +
        `?page_no=${biomarkersDataGridOptions.page}&items_per_page=${biomarkersDataGridOptions.pageSize}&search_text=${searchQuery}`
      );
      if (result.status === 200) {
        const biomarkerRows = result.data.rows?.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          specimen: item.specimen,
          unit: item.unit,
          selling_price: item.selling_price,
        }));
        setBiomarkersDataGridOptions((prev) => ({
          ...prev,
          rows: biomarkerRows,
          totalRows: result.data.count,
          loading: false,
        }));
      }
    } catch (error) {
      setBiomarkersDataGridOptions((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to fetch biomarkers");
    }
  }, [biomarkersDataGridOptions.page, biomarkersDataGridOptions.pageSize, searchQuery]);

  // Fetch Groups
  const getGroupsList = useCallback(async () => {
    setGroupsDataGridOptions((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchList(
        ApiEndPoints.BIOMARKER_GROUPS +
        `?page_no=${groupsDataGridOptions.page}&items_per_page=${groupsDataGridOptions.pageSize}&search_text=${groupSearchQuery}`
      );
      if (result.status === 200) {
        const groupRows = result.data.rows?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          selling_price: item.selling_price,
        }));
        setGroupsDataGridOptions((prev) => ({
          ...prev,
          rows: groupRows,
          totalRows: result.data.count,
          loading: false,
        }));
      }
    } catch (error) {
      setGroupsDataGridOptions((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to fetch groups");
    }
  }, [groupsDataGridOptions.page, groupsDataGridOptions.pageSize, groupSearchQuery]);

  // Add this new function
  // Replace with this paginated version
  // Replace with this optimized version using the new select API
  const fetchAllBiomarkers = useCallback(async () => {
    try {
      const result = await fetchList(ApiEndPoints.GET_BIOMARK_FOR_SELECT);
      if (result.status === 200) {
        setAllBiomarkers(result.data || []); // Assumes response is array of {id, name}
      } else {
        toast.error("Failed to fetch biomarkers for select");
      }
    } catch (error) {
      console.error("Error fetching biomarkers for select:", error);
      toast.error("Failed to fetch biomarkers for select");
    }
  }, []);

  useEffect(() => {
    getBiomarkersList();
  }, [getBiomarkersList]);

  useEffect(() => {
    if (tabValue === 1) {
      getGroupsList();
    }
  }, [tabValue, getGroupsList]);

  // Biomarker Handlers
  const handleOpenBiomarkerDialog = () => {
    setBiomarkerFormData({
      name: "",
      description: "",
      significance: "",
      type: "Quantitative",
      specimen: "Blood",
      unit: "",
      category: "Physiological",
      fasting_required: true,
      fasting_time_hours: "",
      critical_min: "",
      critical_max: "",
      normal_min: "",
      normal_max: "",
      base_price: "",
      selling_price: "",
    });
    setBiomarkerId(null);
    setOpenBiomarkerDialog(true);
  };

  const handleCloseBiomarkerDialog = () => {
    setOpenBiomarkerDialog(false);
    setBiomarkerId(null);
  };

  const handleEditBiomarker = async (id) => {
    try {
      const result = await fetchList(`${ApiEndPoints.BIOMARKERS}/${id}`);
      if (result.status === 200) {
        const biomarker = result.data;
        setBiomarkerFormData({
          name: biomarker.name || "",
          description: biomarker.description || "",
          significance: biomarker.significance || "",
          type: biomarker.type || "Quantitative",
          specimen: biomarker.specimen || "Blood",
          unit: biomarker.unit || "",
          category: biomarker.category || "Physiological",
          fasting_required: biomarker.fasting_required ?? true,
          fasting_time_hours: biomarker.fasting_time_hours || "",
          critical_min: biomarker.critical_min || "",
          critical_max: biomarker.critical_max || "",
          normal_min: biomarker.normal_min || "",
          normal_max: biomarker.normal_max || "",
          base_price: biomarker.base_price || "",
          selling_price: biomarker.selling_price || "",
          image: biomarker.image || null, // ADD IMAGE
        });
        setBiomarkerId(id);
        setOpenBiomarkerDialog(true);
      }
    } catch (error) {
      toast.error("Failed to fetch biomarker details");
    }
  };

  const handleViewBiomarker = (id) => {
    toast.info("View biomarker: " + id);
  };

  const handleDeleteBiomarker = (id) => {
    setDeleteId(id);
    setDeleteType("biomarker");
    setOpenDeleteDialog(true);
  };

  const handleSaveBiomarker = async () => {
    if (!biomarkerFormData.name.trim()) {
      toast.error("Biomarker name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", biomarkerFormData.name);
    formData.append("description", biomarkerFormData.description);
    formData.append("significance", biomarkerFormData.significance);
    formData.append("type", biomarkerFormData.type);
    formData.append("specimen", biomarkerFormData.specimen);
    formData.append("unit", biomarkerFormData.unit);
    formData.append("category", biomarkerFormData.category);
    formData.append("fasting_required", biomarkerFormData.fasting_required);
    formData.append("fasting_time_hours", parseFloat(biomarkerFormData.fasting_time_hours) || 0);
    formData.append("critical_min", parseFloat(biomarkerFormData.critical_min) || 0);
    formData.append("critical_max", parseFloat(biomarkerFormData.critical_max) || 0);
    formData.append("normal_min", parseFloat(biomarkerFormData.normal_min) || 0);
    formData.append("normal_max", parseFloat(biomarkerFormData.normal_max) || 0);
    formData.append("base_price", parseFloat(biomarkerFormData.base_price) || 0);
    formData.append("selling_price", parseFloat(biomarkerFormData.selling_price) || 0);

    if (biomarkerFormData.image && biomarkerFormData.image instanceof File) {
      formData.append("image", biomarkerFormData.image);
    }

    try {
      let result;
      if (biomarkerId) {
        // DON'T set Content-Type manually - let axios handle it
        result = await axios.put(`${ApiEndPoints.BIOMARKERS}/${biomarkerId}`, formData);
      } else {
        result = await axios.post(`${ApiEndPoints.BIOMARKERS}`, formData);
      }

      if (result.status === 200 || result.status === 201) {
        toast.success(result.data.message || "Biomarker saved successfully");
        handleCloseBiomarkerDialog();
        getBiomarkersList();
      } else {
        toast.error(result.data.message || "Failed to save biomarker");
      }
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      toast.error("Failed to save biomarker: " + (error.response?.data?.message || error.message));
    }
  };

  // Group Handlers
  const handleOpenGroupDialog = () => {
    setGroupFormData({
      name: "",
      description: "",
      base_price: "",
      selling_price: "",
      biomarkers: [],
    });
    setGroupId(null);
    setAddonSearchQuery("");
    setOpenGroupDialog(true);
    fetchAllBiomarkers();  // Add this line to load all biomarkers
  };

  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
    setGroupId(null);
    setAllBiomarkers([]);  // Add this to clear on close (optional, for memory)
    setAddonSearchQuery("");
  };

  const handleEditGroup = async (id) => {
    try {
      const result = await fetchList(`${ApiEndPoints.BIOMARKER_GROUPS}/${id}`);
      if (result.status === 200) {
        const group = result.data;

        setGroupFormData({
          name: group.name || "",
          description: group.description || "",
          base_price: group.base_price || "",
          selling_price: group.selling_price || "",
          biomarkers: group.biomarkers?.map((b) => b.id) || [],
          image: group.image || null,
        });

        setGroupId(id);
        setAddonSearchQuery("");
        setOpenGroupDialog(true);

        // ⬇⬇ IMPORTANT: wait until biomarkers list is loaded
        await fetchAllBiomarkers();

        // 🔥 NEW CODE: Sort already-selected biomarkers to TOP
        setAllBiomarkers((prev) => {
          const selected = group.biomarkers?.map((b) => b.id) || [];
          return [
            ...prev.filter((item) => selected.includes(item.id)),     // selected biomarkers → TOP
            ...prev.filter((item) => !selected.includes(item.id)),     // non-selected → bottom
          ];
        });
        // 🔥 END NEW CODE
      }
    } catch (error) {
      toast.error("Failed to fetch group details");
    }
  };

  const handleViewGroup = (id) => {
    toast.info("View group: " + id);
  };

  const handleDeleteGroup = (id) => {
    setDeleteId(id);
    setDeleteType("group");
    setOpenDeleteDialog(true);
  };
  const handleSaveGroup = async () => {
    if (!groupFormData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const groupFormDataPayload = new FormData();
    groupFormDataPayload.append("name", groupFormData.name);
    groupFormDataPayload.append("description", groupFormData.description);
    groupFormDataPayload.append("base_price", parseFloat(groupFormData.base_price) || 0);
    groupFormDataPayload.append("selling_price", parseFloat(groupFormData.selling_price) || 0);

    if (groupFormData.image && groupFormData.image instanceof File) {
      groupFormDataPayload.append("image", groupFormData.image);
    }

    try {
      let groupResult;

      if (groupId) {
        // EDIT existing group
        groupResult = await axios.put(
          `${ApiEndPoints.BIOMARKER_GROUPS}/${groupId}`,
          groupFormDataPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // CREATE new group
        groupResult = await axios.post(
          ApiEndPoints.BIOMARKER_GROUPS,
          groupFormDataPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // Handle success (200 for update, 201 for create)
      if (groupResult.status === 200 || groupResult.status === 201) {
        // Extract group ID (try multiple possible keys)
        const savedGroupId = groupId || groupResult.data.id || groupResult.data.group_id || groupResult.data.data?.id;

        if (!savedGroupId) {
          toast.warn("Group saved, but ID not returned. Biomarkers not updated.");
          handleCloseGroupDialog();
          getGroupsList();
          return;
        }

        // Now update biomarkers
        try {
          const biomarkersResult = await axios.put(
            BIOMARKER_GROUPS_UPDATE_BIOMARKERS.replace(":id", savedGroupId),
            { biomarkers: groupFormData.biomarkers }
          );

          if (biomarkersResult.status === 200) {
            toast.success("Group and biomarkers saved successfully");
          } else {
            toast.warn("Group saved, but failed to update biomarkers");
          }
        } catch (biomarkerError) {
          console.error("Biomarker update error:", biomarkerError);
          toast.warn("Group saved, but failed to update biomarkers");
        }

        handleCloseGroupDialog();
        getGroupsList();
      } else {
        toast.error(groupResult.data.message || "Failed to save group");
      }
    } catch (error) {
      console.error("Save group error:", error);
      toast.error("Failed to save group: " + (error.response?.data?.message || error.message));
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    try {
      const endpoint = deleteType === "biomarker" ? ApiEndPoints.BIOMARKERS : ApiEndPoints.BIOMARKER_GROUPS;
      const result = await deleteRecord(deleteId, endpoint);

      if (result.status === 200) {
        toast.success(result.message || "Deleted successfully");
        if (deleteType === "biomarker") {
          getBiomarkersList();
        } else {
          getGroupsList();
        }
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
    setOpenDeleteDialog(false);
  };

  // Filter biomarkers based on search
  // const filteredAddons = biomarkersDataGridOptions.rows.filter((biomarker) =>
  //   biomarker.name.toLowerCase().includes(addonSearchQuery.toLowerCase())
  // );

  // Handle Select All for biomarkers
  const handleSelectAllBiomarkers = () => {
    const allSelected = groupFormData.biomarkers.length === allBiomarkers.length;
    setGroupFormData({
      ...groupFormData,
      biomarkers: allSelected ? [] : allBiomarkers.map((biomarker) => biomarker.id),
    });
  };

  return (
    <div className="min-width">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Biomarkers</Typography>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Biomarkers" />
          <Tab label="Biomarker Groups" />
        </Tabs>
      </Box>

      {/* Biomarkers Tab */}
      <TabPanel value={tabValue} index={0}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <Button variant="outlined" onClick={handleOpenBiomarkerDialog}>
            Add Biomarker
          </Button>
        </div>

        <div style={{ height: "65vh", width: "100%" }}>
          <DataGrid
            density="compact"
            autoHeight
            getRowHeight={() => "auto"}
            pagination
            paginationMode="server"
            loading={biomarkersDataGridOptions.loading}
            rowCount={biomarkersDataGridOptions.totalRows}
            rowsPerPageOptions={biomarkersDataGridOptions.rowsPerPageOptions}
            rows={biomarkersDataGridOptions.rows}
            columns={biomarkersColumns}
            page={biomarkersDataGridOptions.page - 1}
            pageSize={biomarkersDataGridOptions.pageSize}
            onPageChange={(newPage) => {
              setBiomarkersDataGridOptions((old) => ({
                ...old,
                page: newPage + 1,
              }));
            }}
            onPageSizeChange={(pageSize) => {
              setBiomarkersDataGridOptions((old) => ({
                ...old,
                page: 1,
                pageSize,
              }));
            }}
          />
        </div>
      </TabPanel>

      {/* Biomarker Groups Tab */}
      <TabPanel value={tabValue} index={1}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <TextField
            placeholder="Search Groups"
            variant="outlined"
            size="small"
            value={groupSearchQuery}
            onChange={(e) => setGroupSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <Button variant="outlined" onClick={handleOpenGroupDialog}>
            Add Biomarker Group
          </Button>
        </div>

        <div style={{ height: "65vh", width: "100%" }}>
          <DataGrid
            density="compact"
            autoHeight
            getRowHeight={() => "auto"}
            pagination
            paginationMode="server"
            loading={groupsDataGridOptions.loading}
            rowCount={groupsDataGridOptions.totalRows}
            rowsPerPageOptions={groupsDataGridOptions.rowsPerPageOptions}
            rows={groupsDataGridOptions.rows}
            columns={groupsColumns}
            page={groupsDataGridOptions.page - 1}
            pageSize={groupsDataGridOptions.pageSize}
            onPageChange={(newPage) => {
              setGroupsDataGridOptions((old) => ({
                ...old,
                page: newPage + 1,
              }));
            }}
            onPageSizeChange={(pageSize) => {
              setGroupsDataGridOptions((old) => ({
                ...old,
                page: 1,
                pageSize,
              }));
            }}
          />
        </div>
      </TabPanel>

      {/* Add/Edit Biomarker Dialog */}
      <Dialog open={openBiomarkerDialog} onClose={handleCloseBiomarkerDialog} maxWidth="md" fullWidth>
        <DialogTitle>{biomarkerId ? "Edit Biomarker" : "Add a Biomarker"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                value={biomarkerFormData.name}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={3}
                value={biomarkerFormData.description}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Significance *"
                multiline
                rows={3}
                value={biomarkerFormData.significance}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, significance: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type *</InputLabel>
                <Select
                  value={biomarkerFormData.type}
                  label="Type *"
                  onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, type: e.target.value })}
                >
                  <MenuItem value="Quantitative">Quantitative</MenuItem>
                  <MenuItem value="Qualitative">Qualitative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={biomarkerFormData.category}
                  label="Category *"
                  onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, category: e.target.value })}
                >
                  <MenuItem value="Physiological">Physiological</MenuItem>
                  <MenuItem value="Biochemical">Biochemical</MenuItem>
                  <MenuItem value="Molecular">Molecular</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Fasting Required *</InputLabel>
                <Select
                  value={biomarkerFormData.fasting_required}
                  label="Fasting Required *"
                  onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, fasting_required: e.target.value })}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fasting Time (Hours)"
                type="number"
                value={biomarkerFormData.fasting_time_hours}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, fasting_time_hours: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit *"
                value={biomarkerFormData.unit}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Specimen *</InputLabel>
                <Select
                  value={biomarkerFormData.specimen}
                  label="Specimen *"
                  onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, specimen: e.target.value })}
                >
                  <MenuItem value="Blood">Blood</MenuItem>
                  <MenuItem value="Urine">Urine</MenuItem>
                  <MenuItem value="Saliva">Saliva</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Critical Values *
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min"
                    type="number"
                    size="small"
                    value={biomarkerFormData.critical_min}
                    onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, critical_min: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max"
                    type="number"
                    size="small"
                    value={biomarkerFormData.critical_max}
                    onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, critical_max: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Normal Values *
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min"
                    type="number"
                    size="small"
                    value={biomarkerFormData.normal_min}
                    onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, normal_min: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max"
                    type="number"
                    size="small"
                    value={biomarkerFormData.normal_max}
                    onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, normal_max: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Base Price (AED) *"
                type="number"
                value={biomarkerFormData.base_price}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, base_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Selling Price (AED) *"
                type="number"
                value={biomarkerFormData.selling_price}
                onChange={(e) => setBiomarkerFormData({ ...biomarkerFormData, selling_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Image
              </Typography>
              <input
                type="file"
                accept="image/*"
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
                      setBiomarkerFormData({ ...biomarkerFormData, image: finalFile });
                    } catch (error) {
                      console.error("Image compression error:", error);
                      // Fallback: use original file
                      setBiomarkerFormData({ ...biomarkerFormData, image: file });
                    }
                  } else {
                    // Keep existing image if no new file selected
                    setBiomarkerFormData({ ...biomarkerFormData, image: biomarkerFormData.image });
                  }
                }}
              />
              {biomarkerFormData.image && (
                <Box mt={1}>
                  <img
                    src={
                      typeof biomarkerFormData.image === "string"
                        ? biomarkerFormData.image
                        : URL.createObjectURL(biomarkerFormData.image)
                    }
                    alt="Preview"
                    style={{ width: "120px", height: "auto", borderRadius: "8px" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBiomarkerDialog} style={{ color: "#666" }}>
            Cancel
          </Button>
          <Button onClick={handleSaveBiomarker} variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Group Dialog */}
      <Dialog open={openGroupDialog} onClose={handleCloseGroupDialog} maxWidth="md" fullWidth>
        <DialogTitle>{groupId ? "Edit Biomarker Group" : "Add a Biomarker Group"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                value={groupFormData.name}
                onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={4}
                value={groupFormData.description}
                onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Base Price (AED) *"
                type="number"
                value={groupFormData.base_price}
                onChange={(e) => setGroupFormData({ ...groupFormData, base_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Selling Price (AED) *"
                type="number"
                value={groupFormData.selling_price}
                onChange={(e) => setGroupFormData({ ...groupFormData, selling_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{
                  marginBottom: "11px",
                  color: "rgb(30, 30, 30)",
                  fontSize: "16px",
                  lineHeight: "24px",
                  fontWeight: 500,
                }}
              >
                Select Biomarkers
              </Typography>
              {/* Select All button */}
              <Button
                onClick={handleSelectAllBiomarkers}
                size="small"
                variant="outlined"
                sx={{ mb: 1 }}
              >
                {groupFormData.biomarkers.length === allBiomarkers.length ? "Deselect All" : "Select All"}
              </Button>
              {/* Autocomplete with checkboxes in dropdown */}
              <Autocomplete
                multiple
                disableCloseOnSelect   // ✅ REQUIRED for multi-checkbox selection
                options={allBiomarkers}
                getOptionLabel={(option) => option.name}
                value={allBiomarkers.filter((opt) => groupFormData.biomarkers.includes(opt.id))}
                onChange={(event, newValue) => {
                  setGroupFormData({
                    ...groupFormData,
                    biomarkers: newValue.map((v) => v.id)
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and select biomarkers..."
                    placeholder="Type to search..."
                    variant="outlined"
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                sx={{ width: '100%' }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
                renderOption={(props, option, { selected }) => {
                  return (
                    <li {...props} key={option.id} style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={selected}
                        sx={{ marginRight: 1 }}
                      />
                      {option.name}
                    </li>
                  );
                }}


                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionDisabled={(option) => false}  // Enable all options
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Image
              </Typography>
              <input
                type="file"
                accept="image/*"
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
                      setGroupFormData({ ...groupFormData, image: finalFile });
                    } catch (error) {
                      console.error("Image compression error:", error);
                      // Fallback: use original file
                      setGroupFormData({ ...groupFormData, image: file });
                    }
                  } else {
                    // Keep existing image if no new file selected
                    setGroupFormData({ ...groupFormData, image: groupFormData.image });
                  }
                }}
              />
              {groupFormData.image && (
                <Box mt={1}>
                  <img
                    src={
                      typeof groupFormData.image === "string"
                        ? groupFormData.image
                        : URL.createObjectURL(groupFormData.image)
                    }
                    alt="Preview"
                    style={{ width: "120px", height: "auto", borderRadius: "8px" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGroupDialog} style={{ color: "#666" }}>
            Cancel
          </Button>
          <Button onClick={handleSaveGroup} variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message={`Do you really want to delete this ${deleteType}?`}
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={() => setOpenDeleteDialog(false)}
        handleDialogAction={handleConfirmDelete}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  // Map your Redux state here if needed
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // Map your Redux actions here if needed
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BiomarkerManagement);