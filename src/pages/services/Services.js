import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Input, Uploader } from "rsuite";
import { Table } from "rsuite";
import {
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useDeprecatedAnimatedState } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { rowsPerPageJsonData, specialitiesData } from "../../utils/jsonData";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCallback } from "react";
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";

import { connect } from "react-redux";
import { professionsListFailed } from "../../store/reducers/professionSlice";
import { professionsListSuccess } from "../../store/reducers/professionSlice";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import FormikSelect from "../../components/Formik/FormikSelect";
import {
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/commonSlice";
import Loader from "../../shared/components/Loader";
import Spinner from "../../shared/components/Spinner";
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

const Services = (props) => {
  const {
    professionsList,
    professionsListSuccess,
    professionsListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    specialitiesList,
  } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [previewImage, setPreviewImage] = useState(null);

  const [pageNo, setPageNo] = useState(1);
  const [servicesDataGridOptions, setServicesDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ service: '' })
  const [id, setId] = useState()
  const [filters, setFilters] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const servicesDataGridColumns = [
    // { field: "licence_no", headerName: "License NO", flex: 1 },
    { field: "service", headerName: "Service", flex: 1 },
    {
      field: "serviceType",
      headerName: "Service Type",
      flex: 1,
      renderCell: (params) => params.row.serviceType || "-"
    },

    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={`${params.row.image}`}
            alt="service"
            style={{ height: 40, borderRadius: 4 }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          {/* <CustomIconButton
            onClickAction={() => {
              handleVivew()
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          /> */}
          <CustomIconButton
            onClickAction={() => {
              editServices(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteServices(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setServicesData(professionsList);
  }, [professionsList]);

  const setServicesData = (data) => {
    const profDatagridRows = data?.map((item, index) => ({
      id: item.id,
      service: item.name,          // ✅ API gives "name"
      serviceType: item.serviceType || "-",  // ✅ replace filters with serviceType
      image: item.image,
      actions: "Actions",
    }));



    updateServicesDataGridOptions("rows", profDatagridRows);
  };

  const updateServicesDataGridOptions = (k, v) =>
    setServicesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  // const getSpecialitiesList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
  //   if (result.status === 200) {
  //     specialitiesListSuccess(result.data);
  //   } else {
  //     specialitiesListFailed();
  //   }
  // }, []);

  // useEffect(() => {
  //   getSpecialitiesList();
  // }, [getSpecialitiesList]);

  const getServicesList = useCallback(async () => {
    updateServicesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.SERVICES +
      `?page_no=${servicesDataGridOptions.page}&items_per_page=${servicesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateServicesDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateServicesDataGridOptions("loading", false);
    } else {
      updateServicesDataGridOptions("totalRows", []);
      professionsListFailed();
      updateServicesDataGridOptions("loading", false);
    }
  }, [
    servicesDataGridOptions.page,
    servicesDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getServicesList();
  }, [getServicesList]);

  useEffect(() => {
    getServicesList();
  }, [pageNo]);

  // ✅ FIXED: editServices function
  const editServices = async (id) => {
    setId(id);
    setOpen(true);
    const item = servicesDataGridOptions.rows.find((item) => item.id === id);
    if (item.image) {
      setPreviewImage(`${item.image}`);
    }

    setName({ service: item.service });

    // ✅ FIXED: Convert serviceType back to filters array
    if (item.serviceType && item.serviceType !== "-") {
      // Convert "forMen" or "forMen,forWomen" to ["men", "women"]
      const parsedFilters = item.serviceType.split(",").map(st => 
        st.replace("for", "").toLowerCase()
      );
      setFilters(parsedFilters);
    } else {
      setFilters([]);
    }
  };

  //delete room rate api
  const [openDeleteServicesDialog, setOpenDeleteServicesDialog] =
    React.useState(false);
  const handleCloseDeleteServicesDialog = () =>
    setOpenDeleteServicesDialog(false);
  const [servicesId, setDeleteServicesId] = useState(0);
  const handleConfirmDeleteServicesAction = async () => {
    setOpenDeleteServicesDialog(false);
    const result = await deleteRecord(
      servicesId,
      ApiEndPoints.SERVICES
    );
    if (result.status === 200) {
      toast.success(result.message);
      getServicesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteServices = (id) => {
    setDeleteServicesId(id);
    setOpenDeleteServicesDialog(true);
  };

  // ✅ FIXED: onSubmit function
  const onSubmit = async () => {
    if (!name.service.trim()) {
      toast.error("Service name is required.");
      return;
    }
    
    // ✅ Validate that at least one filter is selected
    if (filters.length === 0) {
      toast.error("Please select at least one service type.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.service);  // ✅ Changed from "service" to "name"
    
    // ✅ Convert filters array to serviceType string (e.g., "forMen", "forWomen")
    const serviceType = filters.map(f => `for${f.charAt(0).toUpperCase() + f.slice(1)}`).join(",");
    formData.append("serviceType", serviceType);  // ✅ Changed from "filters"
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    let result;
    if (!id) {
      result = await createRecord(
        formData,
        ApiEndPoints.SERVICES
      );
    } else {
      result = await updateRecord(
        formData,
        id,
        ApiEndPoints.SERVICES
      );
    }

    if (result.status === 200) {
      toast.success(result.data.message);
      setName({ service: "" });
      setFilters([]);
      setImageFile(null);
      setId();
      setOpen(false);
      getServicesList();
      setPreviewImage(null);
    } else {
      toast.error(result.data.message);
    }
  };


  const handleClose = () => {
    setOpen(false);
    setName({ service: '' });
    setId();
    setPreviewImage(null);
  };

  return (
    <div className="min-width">
      {/* <Spinner /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Services</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Services
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      {/* datatable start */}
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={servicesDataGridOptions.loading}
          rowCount={servicesDataGridOptions.totalRows}
          rowsPerPageOptions={servicesDataGridOptions.rowsPerPageOptions}
          rows={servicesDataGridOptions.rows}
          columns={servicesDataGridColumns}
          page={servicesDataGridOptions.page - 1}
          pageSize={servicesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setServicesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateServicesDataGridOptions("page", 1);
            updateServicesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the Services?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteServicesDialog}
        handleDialogClose={handleCloseDeleteServicesDialog}
        handleDialogAction={handleConfirmDeleteServicesAction}
      />
      {/* datatable end */}

      {/* Vive Dialog */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"View Establishment Types"}
        </DialogTitle>
        <DialogContent>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td><Typography variant="h6"> {'Name :'}</Typography></td>
                <td> {'User Name'}</td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{id ? 'Edit Services' : ' Add Services'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Name"
            type="text"
            fullWidth
            value={name.service}
            variant="standard"
            onChange={(e) => setName({ service: e.target.value })}
          />

          {/* ✅ Filters checkboxes */}
          <div style={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Filters:</Typography>
            {["men", "women", "kids", "seniors"].map((filter) => (
              <label key={filter} style={{ marginRight: "12px" }}>
                <input
                  type="checkbox"
                  value={filter}
                  checked={filters.includes(filter)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters((prev) => [...prev, filter]);
                    } else {
                      setFilters((prev) => prev.filter((f) => f !== filter));
                    }
                  }}
                />{" "}
                {filter}
              </label>
            ))}
          </div>

          {/* ✅ Image file upload */}
          <div style={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Upload Image:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);

                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ marginTop: "10px", maxHeight: "150px", borderRadius: "8px" }}
              />
            )}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className="mt-1"
            size="large"
            variant="contained"
            disableElevation
            type="submit"
            onClick={() => {
              onSubmit()
            }}
            color="primary"
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background:
                "linear-gradient(180deg, #255480 0%, #173450 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  professionsList: state.profession.professionsList,
  specialitiesList: state.common.specialitiesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    professionsListSuccess: (data) => dispatch(professionsListSuccess(data)),
    professionsListFailed: () => dispatch(professionsListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Services);